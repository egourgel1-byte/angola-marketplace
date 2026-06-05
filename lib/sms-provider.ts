export interface SmsProvider {
  sendOtp(phone: string, otp: string): Promise<boolean>
}

export class MockSmsProvider implements SmsProvider {
  async sendOtp(phone: string, otp: string): Promise<boolean> {
    console.log(`[SMS MOCK] Sending OTP [${otp}] to phone number [${phone}]`)
    return true
  }
}

export function getSmsProvider(): SmsProvider {
  return new MockSmsProvider()
}
