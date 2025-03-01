import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { createSign, createVerify, privateDecrypt, publicEncrypt } from 'node:crypto'

const publicKey = readFileSync(join(process.cwd(), 'keys', 'publicKey.pem'), 'utf8')
const privateKey = readFileSync(join(process.cwd(), 'keys', 'privateKey.pem'), 'utf8')

const text = 'Hello, world!'

const encrypted = publicEncrypt(publicKey, Buffer.from(text))

const sign = createSign('SHA256')
sign.update(encrypted)
const signature = sign.sign(privateKey)

writeFileSync(join(process.cwd(), 'keys', 'encrypted.txt'), encrypted)
writeFileSync(join(process.cwd(), 'keys', 'signature.txt'), signature)

const encryptedFromFile = readFileSync(join(process.cwd(), 'keys', 'encrypted.txt'))
const signatureFromFile = readFileSync(join(process.cwd(), 'keys', 'signature.txt'))

const tamperedEncrypted = Buffer.concat([encryptedFromFile, Buffer.from('a')])

const verify = createVerify('SHA256')
verify.update(tamperedEncrypted)
const isVerified = verify.verify(publicKey, signatureFromFile)

console.log('Is signature verified?', isVerified)

if (isVerified) {
  const decrypted = privateDecrypt(privateKey, tamperedEncrypted)
  console.log('Decrypted:', decrypted.toString())
} else {
  console.log('Signature not verified. Decryption not attempted.')
}
