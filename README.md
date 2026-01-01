# Stellar BatchPay

## What Is This?

Stellar BatchPay is a tool that lets you send many cryptocurrency payments at once on the Stellar blockchain. Instead of sending payments one-by-one (which would take forever), BatchPay groups them together and sends them in efficient batches.

Think of it like this: If you need to send money to 500 customers, instead of manually transferring to each person individually, you upload a list of recipients and amounts, and Stellar BatchPay handles everything automatically in seconds.

---

## The Problem It Solves

**Without this tool:**
- You'd need to manually send each payment individually
- You'd have to sign each transaction separately
- Processing hundreds of payments would take hours or days
- You'd be prone to making mistakes with manual entry

**With Stellar BatchPay:**
- Upload a list of payments (in CSV or JSON format)
- The system automatically groups them into efficient batches
- All payments are signed and sent in seconds
- You get a detailed report showing exactly what succeeded and what failed

---

## How It Works (Simple Version)

1. **You prepare a list** of who gets paid and how much
2. **You upload the file** to the web interface or use the command-line tool
3. **The system validates** everything is correct
4. **It automatically groups payments** into batches (Stellar limits how many per transaction)
5. **All payments are signed and submitted** to the Stellar blockchain
6. **You get a report** showing exactly what happened

---

## How It Works (Technical Version)

The system has three main parts:

### 1. Core Library (`lib/stellar/`)
The "engine" that does all the work:
- **Reads your payment files** (JSON or CSV)
- **Checks everything is valid** (correct addresses, valid amounts, etc.)
- **Groups payments into batches** following Stellar's rules (max 100 operations per transaction)
- **Builds the transactions** and signs them with your Stellar account
- **Submits to Stellar** and gets back results

### 2. Web Interface (`app/` and `components/`)
A browser-based tool where you can:
- Upload a CSV or JSON file with your payment list
- See a preview of what will be sent (addresses, amounts, asset types)
- Choose whether to use testnet (practice) or mainnet (real money)
- Click a button to send everything
- See detailed results including transaction IDs

### 3. Command-Line Tool (`cli/`)
For developers and automated systems:
- Run commands from your terminal
- Automate bulk payments in scripts
- Integrate with other systems
- Useful for technical users and systems integration

---

## Getting Started (Non-Technical Users)

### What You Need
- A Stellar account (like a digital wallet)
- The secret key for your account (keep this private!)
- A list of people to pay and amounts (as a CSV or JSON file)
- Enough money in your account for all the payments

### Quick Steps

1. **Start the application:**
   ```
   npm run dev
   ```
   Then open http://localhost:3000 in your browser

2. **Prepare your payment file** (see examples below)

3. **Click "Choose File"** and upload your payment list

4. **Review the preview** to make sure everything looks correct

5. **Select testnet (to practice) or mainnet (real payments)**

6. **Click "Submit Batch"** and wait for it to process

7. **Check the results** to see what succeeded and failed

---

## Payment File Formats

### CSV Format (Easiest for Spreadsheets)

```csv
address,amount,asset
GBBD47UZM2HN7D7XZIZVG4KVAUC36THN5BES6RMNNOK5TUNXAUCVMAKER,10.50,XLM
GBJCHUKZMTFSLOMNC7P4TS4VJJBTCYL3AEYZ7R37ZJNHYQM7MDEBC67,25.00,XLM
GDZST3XVCDTUJ76ZAV2HA72KYXP7NQJLX7NBXGQVVFEWZYZK7WPVNKYA,100.00,USDC:GBUQWP3BOUZX34ULNQG23RQ6F4BWFIDBPPK7B7ILALX7DNZY5GJUSYM
```

**Columns:**
- **address**: The Stellar wallet address of the person getting paid (always starts with 'G')
- **amount**: How much to send (can have decimals like 10.50)
- **asset**: What type of money to send
  - `XLM` for regular Stellar lumens
  - `ASSETNAME:ISSUER` for other assets (like `USDC:GBUQWP3BOUZX34ULNQG23RQ6F4BWFIDBPPK7B7ILALX7DNZY5GJUSYM`)

### JSON Format (For Programmers)

```json
[
  {
    "address": "GBBD47UZM2HN7D7XZIZVG4KVAUC36THN5BES6RMNNOK5TUNXAUCVMAKER",
    "amount": "10.50",
    "asset": "XLM"
  },
  {
    "address": "GBJCHUKZMTFSLOMNC7P4TS4VJJBTCYL3AEYZ7R37ZJNHYQM7MDEBC67",
    "amount": "25.00",
    "asset": "XLM"
  },
  {
    "address": "GDZST3XVCDTUJ76ZAV2HA72KYXP7NQJLX7NBXGQVVFEWZYZK7WPVNKYA",
    "amount": "100.00",
    "asset": "USDC:GBUQWP3BOUZX34ULNQG23RQ6F4BWFIDBPPK7B7ILALX7DNZY5GJUSYM"
  }
]
```

---

## Important Things to Know

### Testnet vs Mainnet
- **Testnet**: Practice mode. Money isn't real, useful for testing before sending real money.
- **Mainnet**: Real money. Only use this when you're sure everything is correct.

### Costs
Each transaction costs a small fee (about 0.00001 XLM per operation). The system automatically calculates and deducts these fees.

### Limits
- Maximum 100 payments per transaction (the system automatically splits larger batches)
- You can't undo a payment once submitted
- You need enough money in your account for all payments plus fees

### Safety
- **Never share your secret key** with anyone
- Always test with testnet first
- Double-check addresses before sending real money
- The system validates everything before sending

---

## Real-World Example

Let's say you need to pay 250 influencers for promoting your product:

1. **Prepare a CSV file** with all 250 addresses and amounts
2. **Upload to the web interface**
3. **System automatically creates 3 transactions** (250 payments ÷ 100 max per transaction = 3 batches)
4. **All 3 are signed and submitted** in seconds
5. **You get a report** showing all 250 payments with their status

Without this tool, you'd be manually sending payments for hours. With it? Done in seconds.

---

## For Developers

### Installation

```bash
npm install
```

### Using the Web Interface

```bash
npm run dev
# Open http://localhost:3000
```

### Using the Command Line

```bash
STELLAR_SECRET_KEY="S..." npm run start -- --input payments.json --network testnet
```

### Architecture

```
lib/stellar/
├── types.ts           # Data structure definitions
├── validator.ts       # Checks all inputs are valid
├── parser.ts          # Reads CSV and JSON files
├── batcher.ts         # Groups payments into batches
├── server.ts          # Connects to Stellar and sends payments
└── index.ts           # Exports public functions

app/
├── page.tsx           # Main web page
└── api/batch-submit/  # Backend API endpoint

components/
├── file-upload.tsx    # Upload file interface
├── batch-summary.tsx  # Preview before sending
└── results-display.tsx# Show results after sending
```

### Key Functions

**Validate payments:**
```typescript
import { validatePaymentInstructions } from '@/lib/stellar';

const errors = validatePaymentInstructions(paymentList);
if (errors.length > 0) {
  console.log('Problems found:', errors);
}
```

**Parse files:**
```typescript
import { parseInput } from '@/lib/stellar';

const payments = await parseInput(fileContent, 'csv');
```

**Submit batch (server-side only):**
```typescript
import { StellarService } from '@/lib/stellar/server';

const service = new StellarService({
  secretKey: process.env.STELLAR_SECRET_KEY,
  network: 'testnet'
});

const results = await service.submitBatch(payments);
```

---

## What Information You Get Back

After submitting, you'll see:

- **Total recipients processed**: How many people got paid
- **Total amount sent**: Combined value of all payments
- **Number of transactions**: How many blockchain transactions were used
- **Per-recipient status**: For each person, did they get paid or was there an error?
- **Transaction IDs**: The blockchain reference for each transaction (so you can verify on a blockchain explorer)
- **Timestamp**: When everything was processed

---

## Common Questions

**Q: What if one payment fails?**
A: The system tries to include failed payments in the next batch automatically. You'll see in the results which ones failed and why.

**Q: Can I cancel payments?**
A: No, once submitted to the blockchain, payments can't be undone. This is why testnet exists — test first!

**Q: How long does it take?**
A: Usually 3-5 seconds per transaction. So 250 payments would take about 10-15 seconds.

**Q: What if my payment file has 500 recipients?**
A: The system automatically splits it into 5 transactions (500 ÷ 100) and processes them all.

**Q: Can I use different types of money?**
A: Yes! In the same batch, you can send some people XLM, others USDC, others any asset on Stellar.

**Q: Is this secure?**
A: Your secret key never leaves your computer/browser. All processing happens locally or on your own server.

---

## Need Help?

1. **Check the examples** in the `examples/` folder
2. **Read error messages carefully** — they tell you exactly what went wrong
3. **Test with testnet first** — always
4. **Review the file format** — make sure addresses are correct
5. **Check Stellar documentation** at https://developers.stellar.org/

---

## License

Open source and free to use.
