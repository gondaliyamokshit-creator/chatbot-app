import { NextRequest, NextResponse } from 'next/server';
import dialogflow from '@google-cloud/dialogflow';

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const projectId = process.env.DIALOGFLOW_PROJECT_ID;
    const clientEmail = process.env.DIALOGFLOW_CLIENT_EMAIL;
    const privateKey = process.env.DIALOGFLOW_PRIVATE_KEY?.replace(/\\n/g, '\n');

    // If credentials are not provided, we return a mock response for testing the UI
    if (!projectId || !clientEmail || !privateKey) {
      console.warn("Dialogflow credentials not fully provided. Returning mock response.");
      return NextResponse.json({
        reply: "This is a simulated response. To connect your actual Dialogflow agent, please configure DIALOGFLOW_PROJECT_ID, DIALOGFLOW_CLIENT_EMAIL, and DIALOGFLOW_PRIVATE_KEY in your environment variables.",
        sessionId,
      });
    }

    const sessionClient = new dialogflow.SessionsClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      projectId,
    });

    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: 'en-US', // Adjust language code if necessary
        },
      },
    };

    const [response] = await sessionClient.detectIntent(request);
    const result = response.queryResult;
    
    // Extract all text messages from fulfillmentMessages if they exist
    let allText = '';
    const products: any[] = [];

    if (result?.fulfillmentMessages && result.fulfillmentMessages.length > 0) {
      const textParts = result.fulfillmentMessages
        .map((msg: any) => {
          if (msg.text && msg.text.text && msg.text.text.length > 0) {
            return msg.text.text.join('\n');
          }
          if (msg.payload && msg.payload.fields && msg.payload.fields.telegram) {
            try {
              // Parse Telegram Protobuf Payload
              const telegramData = msg.payload.fields.telegram.structValue?.fields || msg.payload.fields.telegram;
              
              const imageUrl = telegramData.photo?.stringValue;
              const caption = telegramData.caption?.stringValue || "";
              
              // Extract name and price from caption (e.g. "✨ *Minimalist Canvas Tote*\n💰 Price: ₹699")
              const nameMatch = caption.match(/\*(.*?)\*/);
              const name = nameMatch ? nameMatch[1] : caption.split('\n')[0].replace(/[✨]/g, '').trim();
              
              const priceMatch = caption.match(/Price:\s*([^\n]+)/);
              const price = priceMatch ? priceMatch[1] : "";
              
              // Extract URL
              let link = "#";
              try {
                link = telegramData.reply_markup?.structValue?.fields?.inline_keyboard?.listValue?.values[0]?.listValue?.values[0]?.structValue?.fields?.url?.stringValue || "#";
              } catch (e) {}

              if (imageUrl || name) {
                products.push({
                  category: "Bag",
                  name: name,
                  price: price,
                  imageUrl: imageUrl,
                  link: link
                });
              }
            } catch (e) {
              console.error("Failed to parse telegram payload", e);
            }
            return '';
          } else if (msg.payload) {
             return typeof msg.payload === 'string' ? msg.payload : JSON.stringify(msg.payload);
          }
          return '';
        })
        .filter((text: string) => text.trim() !== '');

      allText = textParts.join('\n\n');
    }

    // Fallback to fulfillmentText if the above extraction is empty
    const finalReply = allText || result?.fulfillmentText || 'Here are some options for you:';

    return NextResponse.json({
      reply: finalReply,
      products: products.length > 0 ? products : undefined,
      sessionId,
    });
  } catch (error: any) {
    console.error('Error processing Dialogflow message:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
