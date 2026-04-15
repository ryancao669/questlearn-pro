export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface LessonStep {
  type: "text" | "video" | "exercise";
  title: string;
  content: string;
  videoUrl?: string;
  exercisePrompt?: string;
  exerciseOptions?: string[];
  exerciseCorrectIndex?: number;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  category: string;
  estimatedMinutes: number;
  knowledgePoints: number;
  redeemablePoints: number;
  steps: LessonStep[];
  quiz: QuizQuestion[];
}

export const lessons: Lesson[] = [
  {
    id: 1,
    title: "Personal Banking",
    description: "Accounts, cards, budgets, and the basics of fees.",
    category: "Banking",
    estimatedMinutes: 3,
    knowledgePoints: 100,
    redeemablePoints: 50,
    steps: [
      {
        type: "text",
        title: "What is a Bank Account?",
        content: "A bank account is a financial arrangement where a bank holds your money and keeps it safe. There are two main types:\n\n**Checking Account** — For everyday spending. You can write checks, use a debit card, and pay bills.\n\n**Savings Account** — For storing money you don't need right away. It earns interest over time.\n\nMost banks are insured by the FDIC, which protects up to $250,000 of your money."
      },
      {
        type: "video",
        title: "How Debit vs Credit Cards Work",
        content: "Watch this quick explainer on the difference between debit and credit cards.",
        videoUrl: "https://www.youtube.com/embed/cKPKBKjmGBk"
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
        title: "Understanding Fees",
        content: "Banks can charge fees that eat into your money:\n\n• **Overdraft Fee** — When you spend more than you have ($35 average)\n• **ATM Fee** — Using another bank's ATM ($2-5 per transaction)\n• **Monthly Maintenance Fee** — Some accounts charge $5-15/month\n• **Minimum Balance Fee** — If your balance drops below a certain amount\n\n**Pro tip:** Many online banks and credit unions offer fee-free accounts!"
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
        question: "Which account type typically earns interest?",
        options: ["Checking account", "Savings account", "Neither", "Both equally"],
        correctIndex: 1
      },
      {
        question: "What is an overdraft fee?",
        options: ["A fee for opening an account", "A fee for spending more than you have", "A monthly service charge", "An ATM fee"],
        correctIndex: 1
      }
    ]
  },
  {
    id: 2,
    title: "Employment and Taxes",
    description: "Job types, take-home pay, and how taxes work.",
    category: "Income",
    estimatedMinutes: 3,
    knowledgePoints: 100,
    redeemablePoints: 50,
    steps: [
      {
        type: "text",
        title: "Types of Employment",
        content: "There are several ways to earn income:\n\n**W-2 Employee** — You work for a company. They withhold taxes from your paycheck.\n\n**1099 Independent Contractor** — You work for yourself. You're responsible for your own taxes.\n\n**Part-time vs Full-time** — Full-time is usually 35-40+ hours/week with benefits. Part-time is fewer hours, often without benefits.\n\nAs a high schooler, your first job will likely be part-time W-2 employment."
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
        title: "Understanding Your Paycheck",
        content: "Your **gross pay** is your total earnings before deductions. Your **net pay** (take-home pay) is what you actually receive.\n\nCommon deductions include:\n• **Federal Income Tax** — Goes to the US government\n• **State Income Tax** — Goes to your state\n• **FICA (Social Security & Medicare)** — 7.65% of your pay\n• **Health Insurance** — If your employer offers it\n\nA $15/hr job at 20 hrs/week ≈ $1,200/month gross, but your take-home might be ~$1,020."
      },
      {
        type: "video",
        title: "Taxes Explained Simply",
        content: "A quick overview of how income taxes work in the US.",
        videoUrl: "https://www.youtube.com/embed/ZHCJqFBXrKY"
      },
      {
        type: "exercise",
        title: "Quick Check: Paychecks",
        content: "What is 'net pay'?",
        exercisePrompt: "What is 'net pay'?",
        exerciseOptions: ["Your total salary", "Pay before taxes", "Your take-home pay after deductions", "Your hourly rate"],
        exerciseCorrectIndex: 2
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
    title: "Budgeting Basics",
    description: "Learn to create and stick to a budget using the 50/30/20 rule.",
    category: "Planning",
    estimatedMinutes: 3,
    knowledgePoints: 100,
    redeemablePoints: 50,
    steps: [
      {
        type: "text",
        title: "Why Budget?",
        content: "A budget is a plan for your money. Without one, it's easy to overspend and end up broke before your next paycheck.\n\n**The 50/30/20 Rule:**\n• **50% Needs** — Rent, food, transportation, phone\n• **30% Wants** — Entertainment, dining out, shopping\n• **20% Savings** — Emergency fund, future goals\n\nEven if you only earn $500/month, budgeting helps you stay in control."
      },
      {
        type: "exercise",
        title: "Quick Check: 50/30/20",
        content: "You earn $1,000/month. How much should go to savings under the 50/30/20 rule?",
        exercisePrompt: "You earn $1,000/month. How much should go to savings under the 50/30/20 rule?",
        exerciseOptions: ["$500", "$300", "$200", "$100"],
        exerciseCorrectIndex: 2
      },
      {
        type: "text",
        title: "Tracking Your Spending",
        content: "To budget effectively, you need to know where your money goes:\n\n1. **List your income** — All money coming in\n2. **Track expenses for a month** — Every purchase, no matter how small\n3. **Categorize** — Group spending into needs, wants, savings\n4. **Adjust** — Cut back on wants if you're overspending\n\n**Tools:** Spreadsheets, apps like Mint or YNAB, or even a simple notebook."
      },
      {
        type: "exercise",
        title: "Categorize This!",
        content: "Netflix subscription is a...",
        exercisePrompt: "Netflix subscription is a...",
        exerciseOptions: ["Need", "Want", "Savings", "Investment"],
        exerciseCorrectIndex: 1
      }
    ],
    quiz: [
      {
        question: "In the 50/30/20 rule, what does the 50% cover?",
        options: ["Wants", "Savings", "Needs", "Investments"],
        correctIndex: 2
      },
      {
        question: "Which is the first step in creating a budget?",
        options: ["Cut all spending", "List your income", "Open a savings account", "Get a credit card"],
        correctIndex: 1
      },
      {
        question: "A gym membership you rarely use is categorized as a...",
        options: ["Need", "Want", "Savings", "Tax"],
        correctIndex: 1
      }
    ]
  },
  {
    id: 4,
    title: "Credit Scores & Debt",
    description: "How credit works, building credit, and avoiding debt traps.",
    category: "Credit",
    estimatedMinutes: 3,
    knowledgePoints: 120,
    redeemablePoints: 60,
    steps: [
      {
        type: "text",
        title: "What is a Credit Score?",
        content: "Your credit score is a number (300-850) that tells lenders how likely you are to repay debt.\n\n**Score Ranges:**\n• 800-850 — Exceptional\n• 740-799 — Very Good\n• 670-739 — Good\n• 580-669 — Fair\n• 300-579 — Poor\n\nYour score affects: loan approval, interest rates, renting an apartment, even some jobs."
      },
      {
        type: "text",
        title: "Building Credit",
        content: "**5 Factors that affect your score:**\n\n1. **Payment History (35%)** — Pay on time, every time\n2. **Credit Utilization (30%)** — Use less than 30% of your limit\n3. **Length of History (15%)** — Longer is better\n4. **Credit Mix (10%)** — Different types of credit\n5. **New Credit (10%)** — Don't open too many accounts at once\n\n**Tip for students:** A secured credit card or being added as an authorized user on a parent's card can help you start building credit."
      },
      {
        type: "exercise",
        title: "Quick Check: Credit",
        content: "What is the most important factor in your credit score?",
        exercisePrompt: "What is the most important factor in your credit score?",
        exerciseOptions: ["Credit mix", "Length of history", "Payment history", "New credit inquiries"],
        exerciseCorrectIndex: 2
      }
    ],
    quiz: [
      {
        question: "What credit score range is considered 'Good'?",
        options: ["300-579", "580-669", "670-739", "740-799"],
        correctIndex: 2
      },
      {
        question: "What percentage of your credit limit should you try to stay under?",
        options: ["50%", "80%", "30%", "100%"],
        correctIndex: 2
      },
      {
        question: "Which factor has the biggest impact on your credit score?",
        options: ["Credit mix", "Payment history", "New credit", "Length of history"],
        correctIndex: 1
      }
    ]
  },
  {
    id: 5,
    title: "Saving & Investing",
    description: "Emergency funds, compound interest, and intro to investing.",
    category: "Investing",
    estimatedMinutes: 3,
    knowledgePoints: 120,
    redeemablePoints: 60,
    steps: [
      {
        type: "text",
        title: "Emergency Fund First",
        content: "Before investing, build an emergency fund:\n\n**Goal:** 3-6 months of expenses saved\n**Where:** High-yield savings account (4-5% APY)\n**Why:** Unexpected expenses — car repairs, medical bills, job loss\n\nAs a student, aim for at least $500-1,000 to start."
      },
      {
        type: "text",
        title: "The Magic of Compound Interest",
        content: "Compound interest = earning interest on your interest.\n\n**Example:** $1,000 invested at 10% annual return:\n• After 10 years: $2,594\n• After 20 years: $6,727\n• After 40 years: $45,259\n\nThe earlier you start, the more time your money has to grow. This is why starting in high school gives you a massive advantage!"
      },
      {
        type: "exercise",
        title: "Quick Check: Compound Interest",
        content: "Why does starting to invest early matter so much?",
        exercisePrompt: "Why does starting to invest early matter so much?",
        exerciseOptions: ["You get tax breaks", "Compound interest has more time to grow", "Stocks are cheaper when you're young", "Banks give better rates to young people"],
        exerciseCorrectIndex: 1
      }
    ],
    quiz: [
      {
        question: "How much should an emergency fund ideally cover?",
        options: ["1 week of expenses", "1 month of expenses", "3-6 months of expenses", "1 year of expenses"],
        correctIndex: 2
      },
      {
        question: "What is compound interest?",
        options: ["Interest only on your original deposit", "Interest on interest", "A bank fee", "A type of loan"],
        correctIndex: 1
      },
      {
        question: "$1,000 at 10% for 40 years becomes approximately...",
        options: ["$2,000", "$10,000", "$25,000", "$45,000"],
        correctIndex: 3
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
