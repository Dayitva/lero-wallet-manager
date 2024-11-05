import { NextResponse } from 'next/server';
import { Wallet } from '@coinbase/coinbase-sdk';
import  '@/lib/server/coinbase';
// import OpenAI from "openai";
// import { ChatCompletionMessageParam } from 'openai/resources/chat/index.mjs';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const walletId = searchParams.get('walletId');

    if (!walletId) {
        return NextResponse.json({ error: 'Wallet ID is required' }, { status: 400 });
    }

    try {
        console.log("Fetching wallet with ID:", walletId);
        const wallet = await Wallet.fetch(walletId); // Log to ensure wallet is fetched correctly

        if (!wallet) {
            console.error("Wallet not found:", walletId);
            return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
        }

        const address1 = await wallet.getDefaultAddress();
        if (!address1) {
            console.error("Default address not found for wallet:", walletId);
            return NextResponse.json({ error: 'Wallet address not found' }, { status: 404 });
        }

        console.log("Fetching transactions for address:", address1);
        const resp = await address1.listTransactions({ limit: 100 });

        const transactions = resp?.data || [];
        if (transactions.length === 0) {
            console.warn("No transactions found for address:", address1);
            return NextResponse.json({ error: 'No transactions found' }, { status: 404 });
        }

        const transactionDetails = transactions.map(transaction => ({
            timestamp: transaction.content()?.block_timestamp,
            toAddressId: transaction.toAddressId(),
            value: transaction.content()?.value
        }));

        return NextResponse.json({ transactions: transactionDetails });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// export async function POST(request: Request) {

//     // res.setHeader('Access-Control-Allow-Origin', '*');
//     // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//     // res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

//     const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

//     try {
//         const { protocolData, riskProfile } = request.body;
        
//         if (!protocolData) {
//             return NextResponse.json({ error: 'Protocol data is required' }, { status: 400 });
//         }

//         if (!riskProfile) {
//             return NextResponse.json({ error: 'Risk profile is required' }, { status: 400 });
//         }

//         const functions = [
//         {
//             name: "calculate_protocol_split",
//             description: "Analyze the user's risk profile and provide a recommended split of assets across different protocols to maximise yield over a certain risk.",
//             parameters: {
//                 type: "object",
//                 properties: {
//                     errorMessage: { type: "string" },
//                     confidenceLevel: { type: "number" },
//                     split: {
//                         type: "array",
//                         items: {
//                             type: "object",
//                             properties: {
//                                 protocol: { type: "string" },
//                                 percentage: { type: "number" }
//                             }
//                         }
//                     }
//                 }
//             },
//             required: ["errorMessage", "confidenceLevel", "split"]
//         }];

//         const messages: ChatCompletionMessageParam[] = [
//         { 
//             role: "system", 
//             content: `Act as a highly motivated world class defi strategist with deep understanding of Defi protocols, security of defi and risks around restaking platforms.

//             Your Task Is :
//             * To evaluate and find restaking opportunities in the world of defi that gives users a profitable yield each time. I have uploaded the data below.

//             Instructions :
//             * Always go step by step. 
//             * Use <thinking> to think through everything before you respond. 
//             * After you're done thinking use <synthesise> to connect different dots and filter out issues early.
//             * Finally, once you're done finally use <reflect> and then answer and give me a list of what could be a profitable investment for me. 
//             * Also tell me what are your preconceived notions / assumptions that you're considering as a world class strategist.

//             Note : 
//             * You have seen multiple cycles. 
//             * You have made 1 mil from 100k multiples times with defi. `
//         },
//         { 
//             role: "user", 
//             content: `Analyze the following restaking protocol data and provide insights. Risk profile: ${riskProfile}\n\n${protocolData}` 
//         }
//         ];

//         const tools: any[] = [
//             {
//                 type: "function",
//                 function: {
//                     name: "calculate_protocol_split",
//                     description: "Analyze the user's risk profile and provide a recommended split of assets across different protocols to maximise yield over a certain risk.",
//                     parameters: {
//                         type: "object",
//                         properties: {
//                             errorMessage: { type: "string" },
//                             confidenceLevel: { type: "number" },
//                             split: {
//                                 type: "array",
//                                 items: {
//                                     type: "object",
//                                     properties: {
//                                         protocol: { type: "string" },
//                                         percentage: { type: "number" }
//                                     }
//                                 }
//                             }
//                         }
//                     },
//                     required: ["errorMessage", "confidenceLevel", "split"],
//                     additionalProperties: false
//                 }
//             }
//         ];

//         const response = await openai.chat.completions.create({
//             model: "gpt-4o",
//             messages: messages,
//             functions: functions,
//             tools: tools,
//             function_call: { name: "calculate_protocol_split" }
//         });

//         const toolCall = response.choices[0].message.tool_calls ? response.choices[0].message.tool_calls[0] : null;
//         if (!toolCall) {
//             return NextResponse.json({ error: 'Tool call not found in the response' }, { status: 500 });
//         }
//         const analysisResult = JSON.parse(toolCall.function.arguments);

//         if (analysisResult.confidenceLevel < 0.7) {
//             return NextResponse.json({
//                 ...analysisResult,
//                 warning: "The analysis may not be accurate due to insufficient data. Please provide more information for a better analysis."
//             }, { status: 200 });
//         }

//         NextResponse.json(analysisResult, {status: 200});
//     } catch (error) {
//         console.error('Error:', error);
//         NextResponse.json({ error: 'An error occurred while analyzing the data' }, {status: 500});
//     }
// }
