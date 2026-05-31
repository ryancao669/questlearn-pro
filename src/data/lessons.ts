export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface LessonStep {
  type: "text" | "video" | "exercise" | "interactive";
  title: string;
  content: string;
  videoUrl?: string;
  exercisePrompt?: string;
  exerciseOptions?: string[];
  exerciseCorrectIndex?: number;
  interactiveType?: "salary-calculator";
  interactiveUrl?: string;
}

export interface ScenarioChoice {
  label: string;
  outcome: string;
  isBest?: boolean;
}

export interface Scenario {
  title: string;
  situation: string;
  choices: ScenarioChoice[];
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  category: string;
  icon: string;
  estimatedMinutes: number;
  knowledgePoints: number;
  redeemablePoints: number;
  steps: LessonStep[];
  quiz: QuizQuestion[];
  scenarios?: Scenario[];
}


export const lessons: Lesson[] = [
  {
    id: 1,
    title: "Personal Banking",
    description: "Bank accounts, debit & credit cards, budgeting, and understanding fees.",
    category: "Banking",
    icon: "🏦",
    estimatedMinutes: 3,
    knowledgePoints: 100,
    redeemablePoints: 50,
    steps: [
      {
        type: "text",
        title: "Bank Accounts",
        content: "A bank account allows you to safely store money, deposit checks, and make purchases using a debit card instead of carrying around cash.\n\nThere are various types of bank accounts:\n\n**Checking Account** — For everyday spending. You can write checks, use a debit card, and pay bills.\n\n**Savings Account** — For storing money you don't need right away. It earns interest over time.\n\nMost banks are insured by the FDIC, which protects up to $250,000 of your money.\n\n**What you should do:** Open the right type of account for your needs. If you make purchases daily, go with checking. If you want a safe place to grow your money, open a savings account."
      },
      {
        type: "exercise",
        title: "Quick Check: Account Types",
        content: "Which type of account is best for everyday spending?",
        exercisePrompt: "Which type of account is best for everyday spending?",
        exerciseOptions: ["Savings Account", "Checking Account", "Certificate of Deposit", "Money Market Account"],
        exerciseCorrectIndex: 1
      },
      {
        type: "text",
        title: "Debit vs. Credit Cards",
        content: "**Debit Card** — Linked directly to your checking account. When you make a purchase, money comes out immediately. You can only spend what you have.\n\n**Credit Card** — Lets you borrow money from the bank to make purchases. You pay the bill at the end of the month.\n\n⚠️ Missing a credit card payment leads to interest charges and fees. But used responsibly, credit cards help you build credit.\n\n**Takeaway:** A debit card lets you spend money you have. A credit card is essentially borrowing money, which requires responsibility.\n\n**Student Action:** Based on your spending habits, decide whether a credit card or debit card is the right choice for you right now."
      },
      {
        type: "video",
        title: "How Debit vs Credit Cards Work",
        content: "Watch this quick explainer on the difference between debit and credit cards.",
        videoUrl: "https://www.youtube.com/embed/sef2NaBhSmM"
      },
      {
        type: "text",
        title: "Budgeting Basics",
        content: "A budget is a plan that tracks how much you earn and how much you spend.\n\nBy creating a budget, you can make sure you have enough for important things while saving for the future.\n\n**The 50/30/20 Rule:**\n• **50% Needs** — Rent, food, transportation, phone\n• **30% Wants** — Entertainment, dining out, shopping\n• **20% Savings** — Emergency fund, future goals\n\n**Takeaway:** A budget puts you in control of your money instead of wondering where it all went.\n\n**Student Action:** Start tracking everything you spend this week, then add it up to see if it matches what you expected."
      },
      {
        type: "exercise",
        title: "Categorize This!",
        content: "A Netflix subscription is a...",
        exercisePrompt: "A Netflix subscription is a...",
        exerciseOptions: ["Need", "Want", "Savings", "Investment"],
        exerciseCorrectIndex: 1
      },
      {
        type: "text",
        title: "Fees & Interest",
        content: "Banks can charge you fees, but they can also pay you interest.\n\n**Common Fees:**\n• **Overdraft Fee** — When you spend more than you have (~$35)\n• **ATM Fee** — Using another bank's ATM ($2-5)\n• **Monthly Maintenance Fee** — Some accounts charge $5-15/month\n• **Minimum Balance Fee** — If your balance drops too low\n\n**Interest:** Savings accounts earn interest — the bank pays you a percentage just for keeping your money there.\n\n**Takeaway:** Fees cost you money for being irresponsible. Interest can earn you money.\n\n**Student Action:** Look up what can cause a fee on your specific bank account. Usually if you're a minor, parents can open an account with no minimum balance fees."
      },
      {
        type: "exercise",
        title: "Quick Check: Fees",
        content: "What happens when you spend more money than you have in your checking account?",
        exercisePrompt: "What happens when you spend more money than you have in your checking account?",
        exerciseOptions: ["You earn interest", "You get an overdraft fee", "Nothing happens", "Your account closes"],
        exerciseCorrectIndex: 1
      }
    ],
    quiz: [
      {
        question: "What does FDIC insurance protect?",
        options: ["Your credit score", "Up to $250,000 in your bank account", "Your investments in stocks", "Your cryptocurrency"],
        correctIndex: 1
      },
      {
        question: "What's the key difference between debit and credit cards?",
        options: ["Debit cards have higher limits", "Credit cards use your own money immediately", "Debit uses your money, credit borrows from the bank", "There is no difference"],
        correctIndex: 2
      },
      {
        question: "In the 50/30/20 rule, what does the 20% cover?",
        options: ["Wants", "Needs", "Entertainment", "Savings"],
        correctIndex: 3
      }
    ]
  },
  {
    id: 2,
    title: "Employment & Taxes",
    description: "Job types, understanding your paycheck, how taxes work, and how to file.",
    category: "Income",
    icon: "💼",
    estimatedMinutes: 3,
    knowledgePoints: 100,
    redeemablePoints: 50,
    steps: [
      {
        type: "text",
        title: "Types of Employment",
        content: "There are several ways to earn income, and each affects your pay, benefits, and taxes differently:\n\n**W-2 Employee (Full-Time)** — Steady hours (35-40+/week), benefits like health insurance. Your employer withholds taxes from your paycheck.\n\n**W-2 Employee (Part-Time)** — Fewer hours, often fewer benefits. Still has taxes withheld.\n\n**1099 Independent Contractor (Self-Employed)** — You choose how much you work. You're responsible for your own taxes and benefits.\n\n**Takeaway:** Your employment type affects more than your paycheck — it shapes your whole financial situation.\n\n**Student Action:** Think about whether full-time, part-time, or self-employment suits your interests best."
      },
      {
        type: "exercise",
        title: "Quick Check: Employment Types",
        content: "If taxes are automatically taken out of your paycheck, you're most likely a...",
        exercisePrompt: "If taxes are automatically taken out of your paycheck, you're most likely a...",
        exerciseOptions: ["1099 Contractor", "W-2 Employee", "Volunteer", "Business Owner"],
        exerciseCorrectIndex: 1
      },
      {
        type: "text",
        title: "Gross Pay vs. Net Pay",
        content: "**Gross Pay** = What you earn before deductions\n**Net Pay** = What you actually take home\n\nYour employer automatically deducts:\n• **Federal Income Tax** — Goes to the U.S. government\n• **State Income Tax** — Goes to your state\n• **FICA (Social Security & Medicare)** — 7.65% of your pay\n• **Health Insurance** — If your employer offers it\n\n📊 **Example:** A $15/hr job at 20 hrs/week ≈ $1,200/month gross, but take-home might be ~$1,020.\n\n**Takeaway:** Always budget using your net pay, not your gross pay.\n\n**Vocabulary:** FICA — Tax deducted from your paycheck to fund Social Security and Medicare."
      },
      {
        type: "interactive",
        title: "💰 Salary Calculator",
        content: "Try this salary calculator to see what your take-home pay would actually look like! Enter a salary (like $100,000) to see the breakdown of where your money goes.",
        interactiveType: "salary-calculator",
        interactiveUrl: "https://ryancao669.github.io/salary-calculator/?v=1"
      },
      {
        type: "text",
        title: "How Taxes Work",
        content: "Taxes are mandatory payments to the government that fund public services like schools and roads.\n\nThe U.S. uses a **progressive tax system** — the more you earn, the higher the rate on portions of your income.\n\n**Example:** Earning $30,000/year puts you in the 12% bracket for part of your income.\n\n**2024 Tax Brackets (Single):**\n• 10% on income up to $11,600\n• 12% on $11,601 – $47,150\n• 22% on $47,151 – $100,525\n• And higher brackets above that\n\n**Takeaway:** Understanding tax brackets helps you plan for your future and avoid surprises.\n\n**Vocabulary:** Progressive Tax — Tax rate increases as income increases."
      },
      {
        type: "exercise",
        title: "Quick Check: Paychecks",
        content: "What is 'net pay'?",
        exercisePrompt: "What is 'net pay'?",
        exerciseOptions: ["Your total salary", "Pay before taxes", "Your take-home pay after deductions", "Your hourly rate"],
        exerciseCorrectIndex: 2
      },
      {
        type: "text",
        title: "Filing Taxes",
        content: "Every year by **April 15**, you submit a tax return to compare what you owe vs. what your employer already took out.\n\nYou file using your **W-2 form** (wage and tax statement from your employer).\n\n**If too much was taken:** You get a refund! 🎉\n**If not enough was taken:** You owe the difference.\n\n**Example:** Joe had $1,800 deducted from his pay but only owed $1,400 — he got a $400 refund.\n\n**Takeaway:** A tax refund isn't bonus money — it's your own money coming back.\n\n**Student Action:** If you had income last year, try filing! You'll likely get money back since part-time jobs usually have low income.\n\n**Vocabulary:** W-2 — Wage and tax statement from your employer."
      }
    ],
    quiz: [
      {
        question: "What form do W-2 employees receive?",
        options: ["1099", "W-2", "W-4", "1040"],
        correctIndex: 1
      },
      {
        question: "FICA taxes fund which programs?",
        options: ["Education and military", "Social Security and Medicare", "State roads and parks", "Federal Reserve"],
        correctIndex: 1
      },
      {
        question: "Your gross pay is $500. After $85 in deductions, what is your net pay?",
        options: ["$500", "$585", "$415", "$85"],
        correctIndex: 2
      }
    ]
  },
  {
    id: 3,
    title: "Credit: Uses & Effects",
    description: "How credit scores work, building credit responsibly, and credit card strategies.",
    category: "Credit",
    icon: "📊",
    estimatedMinutes: 3,
    knowledgePoints: 110,
    redeemablePoints: 55,
    steps: [
      {
        type: "text",
        title: "What is a Credit Score?",
        content: "Your credit score is a number (300–850) that tells lenders how likely you are to repay debt.\n\n**Score Ranges:**\n• 800–850 — Exceptional\n• 740–799 — Very Good\n• 670–739 — Good\n• 580–669 — Fair\n• 300–579 — Poor\n\nYour score affects: loan approval, interest rates, renting an apartment, even some jobs!\n\n**Why it matters now:** Even as a high schooler, the habits you build today affect your score in the future."
      },
      {
        type: "text",
        title: "5 Factors of Your Credit Score",
        content: "**1. Payment History (35%)** — Pay on time, every time. This is the #1 factor.\n\n**2. Credit Utilization (30%)** — Use less than 30% of your credit limit. If your limit is $1,000, keep balances under $300.\n\n**3. Length of History (15%)** — Longer credit history = better. Start early!\n\n**4. Credit Mix (10%)** — Having different types of credit (cards, loans) helps.\n\n**5. New Credit (10%)** — Don't open too many accounts at once.\n\n**Tip for students:** A secured credit card or being an authorized user on a parent's card can help you start building credit."
      },
      {
        type: "exercise",
        title: "Quick Check: Credit Factors",
        content: "What is the most important factor in your credit score?",
        exercisePrompt: "What is the most important factor in your credit score?",
        exerciseOptions: ["Credit mix", "Length of history", "Payment history", "New credit inquiries"],
        exerciseCorrectIndex: 2
      },
      {
        type: "text",
        title: "Building Credit as a Student",
        content: "You don't need to wait until you're older to start building credit:\n\n**Option 1: Secured Credit Card** — You deposit money (say $200) as collateral. The bank gives you a card with that as your limit. Use it for small purchases and pay in full each month.\n\n**Option 2: Authorized User** — Ask a parent to add you to their credit card. Their good history can help boost your score.\n\n**Option 3: Student Credit Card** — Some banks offer cards specifically for students with no credit history.\n\n**Golden Rule:** Only charge what you can pay off in full each month. Never carry a balance if you can avoid it."
      },
      {
        type: "exercise",
        title: "Quick Check: Utilization",
        content: "Your credit card limit is $1,000. What's the maximum balance you should carry to maintain good credit?",
        exercisePrompt: "Your credit card limit is $1,000. What's the maximum balance you should carry?",
        exerciseOptions: ["$1,000", "$500", "$300", "$100"],
        exerciseCorrectIndex: 2
      }
    ],
    quiz: [
      {
        question: "What credit score range is considered 'Good'?",
        options: ["300–579", "580–669", "670–739", "740–799"],
        correctIndex: 2
      },
      {
        question: "Which factor has the biggest impact on your credit score?",
        options: ["Credit mix", "Payment history", "New credit", "Length of history"],
        correctIndex: 1
      },
      {
        question: "What percentage of your credit limit should you try to stay under?",
        options: ["50%", "80%", "30%", "100%"],
        correctIndex: 2
      }
    ],
    scenarios: [
      {
        title: "Your First Credit Card",
        situation: "You just got approved for a credit card with a $1,000 limit. You really want a new $700 pair of headphones. What do you do?",
        choices: [
          { label: "Buy them — you'll pay the bill at the end of the month", outcome: "Risky. That's 70% utilization, which can ding your credit score even if you pay on time. Try to stay under 30% ($300).", isBest: false },
          { label: "Save up and pay in cash, use the card for small purchases you can pay off monthly", outcome: "Smart move. Low utilization + on-time payments = strong credit history. Your future self will thank you.", isBest: true },
          { label: "Max it out — points and rewards!", outcome: "Bad call. Maxing a card tanks your score and traps you in high-interest debt if you can't pay it off in full.", isBest: false },
        ],
      },
    ],
  },

  {
    id: 4,
    title: "Debt: Uses & Effects",
    description: "Good debt vs. bad debt, student loans, and strategies to avoid debt traps.",
    category: "Debt",
    icon: "⚖️",
    estimatedMinutes: 3,
    knowledgePoints: 110,
    redeemablePoints: 55,
    steps: [
      {
        type: "text",
        title: "Good Debt vs. Bad Debt",
        content: "Not all debt is created equal.\n\n**Good Debt** — Borrowing that helps you build wealth or increase earning potential:\n• Student loans (investing in education)\n• Mortgage (building home equity)\n• Business loans (growing a company)\n\n**Bad Debt** — Borrowing for things that lose value or don't generate income:\n• Credit card debt on shopping sprees\n• Car loans you can't afford\n• Payday loans with sky-high interest\n\n**Key Question:** Will this debt help me earn more money in the future? If yes, it might be worth it."
      },
      {
        type: "exercise",
        title: "Good or Bad Debt?",
        content: "Taking out a student loan to get a nursing degree is an example of...",
        exercisePrompt: "Taking out a student loan to get a nursing degree is an example of...",
        exerciseOptions: ["Bad debt", "Good debt", "No debt", "Neutral debt"],
        exerciseCorrectIndex: 1
      },
      {
        type: "text",
        title: "Student Loans 101",
        content: "**Federal Student Loans** — From the government. Lower interest rates, flexible repayment options.\n• Subsidized: Government pays interest while you're in school\n• Unsubsidized: Interest starts accruing immediately\n\n**Private Student Loans** — From banks. Often higher interest rates, fewer protections.\n\n**Key Numbers (2024):**\n• Average student loan debt: ~$37,000\n• Average monthly payment: ~$300–500\n• Federal interest rates: ~5–7%\n\n**Rule of Thumb:** Don't borrow more than your expected first-year salary after graduation."
      },
      {
        type: "text",
        title: "The Danger of Minimum Payments",
        content: "Credit card companies love when you pay the minimum — because they make more money from interest.\n\n**Example:** $5,000 credit card balance at 20% APR:\n• Minimum payments only: Takes **25+ years** to pay off, costs **$10,000+ in interest**\n• Paying $200/month: Paid off in **2.5 years**, costs ~$1,300 in interest\n\n**Debt Snowball Method:** Pay minimums on all debts, then put extra money toward the smallest balance first. Once it's paid off, move to the next one.\n\n**Takeaway:** Always pay more than the minimum. Even an extra $20/month makes a huge difference."
      },
      {
        type: "exercise",
        title: "Quick Check: Student Loans",
        content: "Which type of federal student loan does NOT accrue interest while you're in school?",
        exercisePrompt: "Which type of federal student loan does NOT accrue interest while you're in school?",
        exerciseOptions: ["Unsubsidized", "Private", "Subsidized", "Parent PLUS"],
        exerciseCorrectIndex: 2
      }
    ],
    quiz: [
      {
        question: "Which is an example of 'good debt'?",
        options: ["Maxed credit card at the mall", "Payday loan", "Student loan for a degree", "Luxury car loan"],
        correctIndex: 2
      },
      {
        question: "What's the rule of thumb for student loan borrowing?",
        options: ["Borrow as much as possible", "Don't borrow more than first-year salary", "Only use private loans", "Never take any loans"],
        correctIndex: 1
      },
      {
        question: "Why is paying only the minimum on credit cards dangerous?",
        options: ["It hurts your credit score immediately", "You pay much more in interest over time", "The bank closes your account", "You can't make purchases"],
        correctIndex: 1
      }
    ],
    scenarios: [
      {
        title: "The Surprise Expense",
        situation: "Your car breaks down and the repair costs $500. You have $300 in savings. How do you cover the rest?",
        choices: [
          { label: "Take out a payday loan for the $200", outcome: "Avoid this. Payday loans often have 300%+ APR — you could end up owing $400+ on a $200 loan.", isBest: false },
          { label: "Use your $300 savings + put $200 on a credit card you can pay off next month", outcome: "Reasonable. As long as you pay the full balance before interest hits, this is the cheapest borrowing option.", isBest: true },
          { label: "Ignore it and keep driving", outcome: "A small problem becomes a $2,000 problem. Delayed maintenance almost always costs more.", isBest: false },
        ],
      },
    ],
  },

  {
    id: 6,
    title: "Investing & Building Wealth",
    description: "Emergency funds, compound interest, stocks, and retirement accounts.",
    category: "Investing",
    icon: "📈",
    estimatedMinutes: 3,
    knowledgePoints: 120,
    redeemablePoints: 60,
    steps: [
      {
        type: "text",
        title: "Emergency Fund First",
        content: "Before investing, build an emergency fund:\n\n**Goal:** 3–6 months of expenses saved\n**Where:** High-yield savings account (4–5% APY)\n**Why:** Unexpected expenses — car repairs, medical bills, job loss\n\nAs a student, aim for at least **$500–1,000** to start. This is your financial safety net."
      },
      {
        type: "text",
        title: "The Power of Compound Interest",
        content: "Compound interest = earning interest on your interest. It's the most powerful force in building wealth.\n\n**Example — $1,000 invested at 10% annual return:**\n• After 10 years: $2,594\n• After 20 years: $6,727\n• After 40 years: $45,259\n\nStarting in high school gives you a **massive advantage**. Someone who starts at 18 vs. 28 can end up with 2–3x more money by retirement.\n\n**The Rule of 72:** Divide 72 by your interest rate to estimate how many years it takes to double your money. At 10%: 72 ÷ 10 = ~7.2 years."
      },
      {
        type: "exercise",
        title: "Quick Check: Compound Interest",
        content: "Why does starting to invest early matter so much?",
        exercisePrompt: "Why does starting to invest early matter so much?",
        exerciseOptions: ["You get tax breaks", "Compound interest has more time to grow", "Stocks are cheaper when you're young", "Banks give better rates to young people"],
        exerciseCorrectIndex: 1
      },
      {
        type: "text",
        title: "Types of Investments",
        content: "**Stocks** — Owning a piece of a company. Higher risk, higher potential reward.\n\n**Bonds** — Lending money to a company or government. Lower risk, lower returns.\n\n**Index Funds** — A basket of many stocks (like the S&P 500). Great for beginners because they're diversified and low-cost.\n\n**Retirement Accounts:**\n• **401(k)** — Through your employer. Often includes matching (free money!)\n• **Roth IRA** — You contribute after-tax money, but withdrawals in retirement are tax-free\n\n**Student Action:** Even investing $25/month in an index fund as a teenager can grow to $50,000+ by retirement."
      },
      {
        type: "exercise",
        title: "Quick Check: Investments",
        content: "Which investment type is best for beginners who want diversification?",
        exercisePrompt: "Which investment type is best for beginners who want diversification?",
        exerciseOptions: ["Individual stocks", "Cryptocurrency", "Index funds", "Bonds only"],
        exerciseCorrectIndex: 2
      }
    ],
    quiz: [
      {
        question: "How much should an emergency fund ideally cover?",
        options: ["1 week of expenses", "1 month of expenses", "3–6 months of expenses", "1 year of expenses"],
        correctIndex: 2
      },
      {
        question: "Using the Rule of 72, how long to double money at 8% return?",
        options: ["6 years", "8 years", "9 years", "12 years"],
        correctIndex: 2
      },
      {
        question: "What makes a Roth IRA special?",
        options: ["No contribution limits", "Employer matching", "Tax-free withdrawals in retirement", "Guaranteed returns"],
        correctIndex: 2
      }
    ]
  },
  {
    id: 7,
    title: "Consumer Protection",
    description: "Identifying scams, protecting your identity, and knowing your rights.",
    category: "Protection",
    icon: "🛡️",
    estimatedMinutes: 3,
    knowledgePoints: 110,
    redeemablePoints: 55,
    steps: [
      {
        type: "text",
        title: "Common Scams Targeting Young People",
        content: "Scammers specifically target students and young adults. Watch out for:\n\n**Phishing** — Fake emails/texts pretending to be your bank, school, or a company. They want your login info or personal data.\n\n**Too Good to Be True** — \"Make $5,000/week from home!\" or \"Free iPhone — just enter your info!\" These are almost always scams.\n\n**Fake Job Offers** — \"We'll send you a check, deposit it, and wire us back the difference.\" The check is fake.\n\n**Social Media Scams** — Fake giveaways, impersonation accounts, \"investment opportunities\" from strangers.\n\n**Romance Scams** — Someone online builds trust then asks for money.\n\n**Rule of Thumb:** If someone is asking for money, personal info, or it sounds too good to be true — it's probably a scam."
      },
      {
        type: "exercise",
        title: "Spot the Scam",
        content: "You receive a text saying 'Your bank account has been compromised. Click this link to verify your identity.' What should you do?",
        exercisePrompt: "What should you do?",
        exerciseOptions: ["Click the link immediately", "Reply with your account info", "Call your bank directly using the number on their website", "Forward it to your friends"],
        exerciseCorrectIndex: 2
      },
      {
        type: "text",
        title: "Protecting Your Identity",
        content: "**Identity theft** is when someone uses your personal information to open accounts or make purchases in your name.\n\n**How to protect yourself:**\n• Never share your Social Security Number unless absolutely necessary\n• Use strong, unique passwords for every account\n• Enable two-factor authentication (2FA) everywhere\n• Monitor your bank statements regularly\n• Shred documents with personal info\n• Check your credit report annually at annualcreditreport.com (free!)\n\n**If you're a victim:**\n1. Contact your bank immediately\n2. Place a fraud alert on your credit\n3. File a report at identitytheft.gov"
      },
      {
        type: "text",
        title: "Your Consumer Rights",
        content: "As a consumer, you have legal protections:\n\n**Fair Credit Reporting Act** — You can dispute errors on your credit report for free.\n\n**Truth in Lending Act** — Lenders must disclose all terms and costs before you borrow.\n\n**Fair Debt Collection Practices Act** — Debt collectors can't harass you or call at unreasonable hours.\n\n**Cooling-Off Rule** — You can cancel certain purchases within 3 days.\n\n**Where to Report Problems:**\n• Federal Trade Commission (FTC): ftc.gov\n• Consumer Financial Protection Bureau (CFPB)\n• Your state's Attorney General\n\n**Takeaway:** You have rights. Don't be afraid to use them."
      },
      {
        type: "exercise",
        title: "Quick Check: Protection",
        content: "What is the best way to check for identity theft?",
        exercisePrompt: "What is the best way to check for identity theft?",
        exerciseOptions: ["Post your info on social media", "Check your credit report annually for free", "Ignore your bank statements", "Give your SSN to websites that ask"],
        exerciseCorrectIndex: 1
      }
    ],
    quiz: [
      {
        question: "What is phishing?",
        options: ["A type of investment", "Fake messages trying to steal your info", "A banking fee", "A credit score factor"],
        correctIndex: 1
      },
      {
        question: "How often can you check your credit report for free?",
        options: ["Never", "Once a year", "Only if you pay", "Every 5 years"],
        correctIndex: 1
      },
      {
        question: "What should you do first if you think your identity was stolen?",
        options: ["Wait and see", "Contact your bank immediately", "Post about it online", "Close all your accounts"],
        correctIndex: 1
      }
    ],
    scenarios: [
      {
        title: "Suspicious Text Message",
        situation: '"BANK ALERT: Unusual activity on your account. Click here to verify: bit.ly/secure-bank-login" — what do you do?',
        choices: [
          { label: "Click the link and log in to check", outcome: "That's exactly what scammers want. The fake site captures your login and drains your account.", isBest: false },
          { label: "Ignore the text and log into your bank using the official app or website", outcome: "Perfect. Always go to the source directly. If something's wrong, your real bank app will show it.", isBest: true },
          { label: "Reply STOP to unsubscribe", outcome: "Replying confirms your number is active — you'll get even more scam texts. Just delete and report as spam.", isBest: false },
        ],
      },
    ],
  },

  {
    id: 8,
    title: "Financing Your Education",
    description: "Scholarships, merit aid, FAFSA, student loans, and minimizing college costs.",
    category: "Education",
    icon: "🎓",
    estimatedMinutes: 3,
    knowledgePoints: 120,
    redeemablePoints: 60,
    steps: [
      {
        type: "text",
        title: "The True Cost of College",
        content: "College costs more than just tuition:\n\n**Direct Costs:**\n• Tuition & fees: $10,000–$55,000+/year\n• Room & board: $10,000–$18,000/year\n• Books & supplies: $1,000–$1,500/year\n\n**Hidden Costs:**\n• Transportation, food, personal expenses\n• Opportunity cost (money you could be earning)\n\n**The good news:** Very few people pay the full \"sticker price.\" Financial aid, scholarships, and grants can significantly reduce your costs.\n\n**Key Term:** Net Price = Total Cost - Financial Aid. This is what you actually pay."
      },
      {
        type: "text",
        title: "Free Money: Scholarships & Grants",
        content: "**Scholarships** — Money you don't have to pay back, awarded for merit, talent, or specific criteria.\n\n**Types of Scholarships:**\n• **Merit-based** — Academic achievement, GPA, test scores\n• **Athletic** — Sports performance\n• **Community** — Local organizations, Rotary, businesses\n• **Identity-based** — Heritage, background, field of study\n• **Essay/competition** — Writing contests, science fairs\n\n**Grants** — Need-based free money, usually from the government.\n• **Pell Grant** — Up to $7,395/year for low-income students\n• **State grants** — Varies by state\n\n**Student Action:** Start searching for scholarships NOW. Websites: Fastweb, Scholarships.com, Bold.org\n\n**Tip:** Apply for MANY scholarships. Even small ones ($500) add up!"
      },
      {
        type: "exercise",
        title: "Quick Check: Free Money",
        content: "What is the difference between a scholarship and a grant?",
        exercisePrompt: "What's the main difference between scholarships and grants?",
        exerciseOptions: ["Scholarships must be repaid", "Grants are merit-based, scholarships are need-based", "Scholarships are typically merit-based, grants are need-based", "There is no difference"],
        exerciseCorrectIndex: 2
      },
      {
        type: "text",
        title: "FAFSA & Financial Aid",
        content: "**FAFSA** (Free Application for Federal Student Aid) is the key to unlocking financial aid.\n\n**When to file:** Opens October 1 each year. File as early as possible!\n\n**What it determines:**\n• Pell Grant eligibility\n• Federal student loan amounts\n• Work-study eligibility\n• Many state and school-based aid programs\n\n**What you need to file:**\n• Social Security Number\n• Parent/guardian tax returns\n• Bank statements\n• School list (up to 20 schools)\n\n**Important:** Even if you think you won't qualify, FILE ANYWAY. Many schools require FAFSA for any financial aid.\n\n**After filing:** You'll receive a Student Aid Report (SAR) and schools will send financial aid offers."
      },
      {
        type: "text",
        title: "Smart Borrowing for College",
        content: "If scholarships and grants don't cover everything:\n\n**Borrow Smart:**\n1. **Federal loans first** — Always exhaust federal options before private loans\n2. **Subsidized > Unsubsidized** — Subsidized loans don't accrue interest in school\n3. **Borrow only what you need** — Just because you're offered $20,000 doesn't mean you should take it all\n\n**Ways to Reduce Costs:**\n• Community college for 2 years, then transfer (save $20,000+)\n• In-state public university vs. out-of-state\n• AP credits to skip courses\n• Work part-time or work-study\n• Live at home if possible\n\n**The 1x Rule:** Try not to borrow more than your expected first-year salary."
      },
      {
        type: "exercise",
        title: "Quick Check: FAFSA",
        content: "When should you file the FAFSA?",
        exercisePrompt: "When does the FAFSA open each year?",
        exerciseOptions: ["January 1", "April 15", "October 1", "September 1"],
        exerciseCorrectIndex: 2
      }
    ],
    quiz: [
      {
        question: "What is 'net price' for college?",
        options: ["The sticker price", "Total cost minus financial aid", "Just tuition", "Room and board only"],
        correctIndex: 1
      },
      {
        question: "Which type of federal loan is best because interest doesn't accrue in school?",
        options: ["Unsubsidized", "Private", "Parent PLUS", "Subsidized"],
        correctIndex: 3
      },
      {
        question: "Why should you file the FAFSA even if you think you won't qualify?",
        options: ["It's the law", "Many schools require it for any financial aid", "It improves your credit score", "You get automatic scholarships"],
        correctIndex: 1
      }
    ]
  }
];

export const rewards = [
  { id: 1, name: "CQ Sticker Pack", cost: 50, emoji: "🏷️", description: "A set of Cash Quest stickers" },
  { id: 2, name: "Homework Pass", cost: 100, emoji: "📝", description: "Skip one homework assignment" },
  { id: 3, name: "Extra Credit Points", cost: 150, emoji: "⭐", description: "+5 extra credit points in class" },
  { id: 4, name: "Snack Voucher", cost: 75, emoji: "🍕", description: "Free snack from the cafeteria" },
  { id: 5, name: "Library Lounge Pass", cost: 200, emoji: "📚", description: "Access the library lounge for a week" },
  { id: 6, name: "Custom Certificate", cost: 300, emoji: "🏆", description: "Printed certificate of financial literacy" },
];
