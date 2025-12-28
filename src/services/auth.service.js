const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { generateOtp } = require('../utils/otp');
const { sendEmail } = require('../utils/email');
const { hashPassword, comparePassword } = require('../utils/hash');
const { signJwt } = require('../utils/jwt');

exports.requestSignupOtp = async ({ name, email, phone, password, role }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error('Email already exists');

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.oTP.create({ data: { email, otp, expiresAt } });

  await sendEmail(
    email,
    'Signup OTP',
    `Your verification code is: ${otp}. It will expire in 5 minutes.`
  );
};

exports.verifySignupOtp = async ({ email, otp, name, phone, password, role }) => {
  const record = await prisma.oTP.findFirst({ where: { email, otp } });
  if (!record || record.expiresAt < new Date())
    throw new Error('Invalid or expired OTP');

  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: { name, email, phone, password: hashed, role },
  });

  await prisma.oTP.delete({ where: { id: record.id } });
  return user;
};

exports.requestLoginOtp = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  const valid = await comparePassword(password, user.password);
  if (!valid) throw new Error('Invalid credentials');

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.oTP.upsert({
    where: { email },
    update: { otp, expiresAt },
    create: { email, otp, expiresAt },
  });

  await sendEmail(
    email,
    'Login OTP',
    `Your verification code is: ${otp}. It will expire in 5 minutes.`
  );
};

exports.verifyLoginOtp = async ({ email, otp }) => {
  const record = await prisma.oTP.findFirst({ where: { email, otp } });
  if (!record || record.expiresAt < new Date())
    throw new Error('Invalid or expired OTP');

  const user = await prisma.user.findUnique({ where: { email } });

  const token = signJwt({ userId: user.id, role: user.role });

  await prisma.oTP.delete({ where: { id: record.id } });

  return { token, role: user.role };
};
