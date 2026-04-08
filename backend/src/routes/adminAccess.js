import express from 'express'
import admin from 'firebase-admin'
import Member from '../models/Member.js'
import verifyToken from '../middleware/auth.js'
import sendAdminInvite from '../utils/sendEmail.js'

const router = express.Router()

// Helper — generate email from name
const generateEmail = (name) => {
  const cleaned = name.toLowerCase().replace(/\s+/g, '.')
  const random = Math.floor(1000 + Math.random() * 9000)
  return `${cleaned}.${random}@kpdevcell.admin`
}

// Helper — generate random password
const generatePassword = () => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let password = ''
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

// GET all members with their admin status
router.get('/', verifyToken, async (req, res) => {
  try {
    const members = await Member.find().select('name role batch photo_url firebaseUid hasAdminAccess adminEmail')
    res.json(members)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST — give admin access to a member
router.post('/give/:memberId', verifyToken, async (req, res) => {
  try {
    const member = await Member.findById(req.params.memberId)
    if (!member) return res.status(404).json({ message: 'Member not found' })
    if (member.hasAdminAccess) return res.status(400).json({ message: 'Member already has admin access' })

    const generatedEmail = generateEmail(member.name)
    const generatedPassword = generatePassword()

    // Step 1 — try sending email FIRST before creating anything
    try {
      await sendAdminInvite({
        toEmail: req.body.personalEmail,
        name: member.name,
        generatedEmail,
        generatedPassword
      })
    } catch (emailErr) {
      return res.status(400).json({ message: 'Failed to send email — check the email address and try again' })
    }

    // Step 2 — only create Firebase account if email succeeded
    const firebaseUser = await admin.auth().createUser({
      email: generatedEmail,
      password: generatedPassword,
      displayName: member.name
    })

    // Step 3 — only update DB if Firebase succeeded
    member.hasAdminAccess = true
    member.firebaseUid = firebaseUser.uid
    member.adminEmail = generatedEmail
    await member.save()

    res.json({ message: `Admin access given to ${member.name}` })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST — remove admin access from a member
router.post('/remove/:memberId', verifyToken, async (req, res) => {
  try {
    const member = await Member.findById(req.params.memberId)
    if (!member) return res.status(404).json({ message: 'Member not found' })
    if (!member.hasAdminAccess) return res.status(400).json({ message: 'Member does not have admin access' })

    // Delete Firebase account completely
    await admin.auth().deleteUser(member.firebaseUid)

    // Clean up member record in DB
    member.hasAdminAccess = false
    member.firebaseUid = ''
    member.adminEmail = ''
    await member.save()

    res.json({ message: `Admin access removed from ${member.name}` })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router