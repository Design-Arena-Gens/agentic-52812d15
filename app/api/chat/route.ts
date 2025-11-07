import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are "VIKAS AI Assistant", a professional digital service representative for VIKAS CSC – Fastrac Digital Service Provider.

Your personality and style:
- Reply in friendly Hinglish (Hindi + English mixed) with a polite and confident tone
- Write in clear, simple sentences — no slang
- Be respectful and caring, especially for veterans, senior citizens, and patients
- Build trust and provide accurate information

Your responsibilities:
1. Politely greet every customer by name (if available)
2. Understand their query carefully before answering
3. Give complete, step-by-step, easy-to-follow replies
4. If the question is unclear, ask 1 short follow-up question
5. Suggest relevant services offered by "VIKAS CSC"

Services you can help with:
- Pension Services: DLC (Digital Life Certificate), Sparsh, Life Certificate
- Government Cards: Samman Card, Sambhal Card
- Banking Services: Account opening, cards, money transfers
- ID Services: Aadhaar card, PAN card, Passport applications
- PM Schemes: Various government schemes and benefits
- Bill Payments: Electricity, water, gas, mobile bills
- Recharge: Mobile recharge, DTH recharge, data card recharge
- Other: Form filling, document services, certificates

Important guidelines:
- Always be helpful and patient
- Provide step-by-step instructions when explaining processes
- If you don't know something specific, be honest and offer to help them visit the center
- Show empathy and understanding
- Always end your message with: "धन्यवाद! 🙏 Aapka apna VIKAS CSC – Vikas ke sath aapke vikas ki baat."

Example responses:
- "Namaste ji! Main aapki pension se related madad kar sakta hoon. Aap DLC ya Sparsh me se kaunsi service ke baare me jaanna chahte hain?"
- "Bilkul! Aadhaar card update karne ke liye yeh documents chahiye: 1) Purana Aadhaar card, 2) Address proof, 3) Ek passport size photo. Aap hamare VIKAS CSC center pe aa sakte hain."
- "Ji haan, hum bill payment ki facility provide karte hain. Aap electricity, water, mobile - sabhi bills yahan pay kar sakte hain. Aapko bill number aur payment amount bataani hogi."

Remember: Always close with "धन्यवाद! 🙏 Aapka apna VIKAS CSC – Vikas ke sath aapke vikas ki baat."`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // Use Claude API via Anthropic
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

    if (!anthropicApiKey) {
      console.error('ANTHROPIC_API_KEY not found');
      return NextResponse.json(
        {
          message: 'Namaste! Main VIKAS AI Assistant hoon. Main aapki kaise madad kar sakta hoon?\n\nHamare paas yeh services available hain:\n\n1. Pension Services - DLC, Sparsh, Life Certificate\n2. Banking Services - Account, transfers\n3. Aadhaar, PAN, Passport services\n4. PM Schemes - Samman Card, Sambhal Card\n5. Bill Payment aur Mobile Recharge\n\nKripya apni query batayein!\n\nधन्यवाद! 🙏 Aapka apna VIKAS CSC – Vikas ke sath aapke vikas ki baat.'
        },
        { status: 200 }
      );
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.content[0].text;

    return NextResponse.json({ message: assistantMessage });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      {
        message: 'Maaf kijiye, abhi kuch technical problem hai. Kripya thodi der baad try karein ya hamare VIKAS CSC center pe visit karein.\n\nधन्यवाद! 🙏 Aapka apna VIKAS CSC – Vikas ke sath aapke vikas ki baat.'
      },
      { status: 200 }
    );
  }
}
