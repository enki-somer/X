export const SAMPLE_USERS = [
  {
    _id: "user1",
    fullName: "Sarah Chen",
    username: "sarahchen",
    profileImg: "/avatars/girl1.png",
    bio: "Full-stack developer | Open source contributor | Coffee lover ☕",
    verified: true,
  },
  {
    _id: "user2",
    fullName: "Alex Rivera",
    username: "arivera",
    profileImg: "/avatars/boy1.png",
    bio: "Tech lead @innovatetech | Building the future of web3",
    verified: true,
  },
  {
    _id: "user3",
    fullName: "Maya Patel",
    username: "mayatech",
    profileImg: "/avatars/girl2.png",
    bio: "AI researcher | Python enthusiast 🐍 | Tea > Coffee",
  },
  {
    _id: "user4",
    fullName: "James Wilson",
    username: "jwilson",
    profileImg: "/avatars/boy2.png",
    bio: "Software Engineer | React Native expert 📱",
  },
];

export const SAMPLE_POSTS = [
  {
    _id: "thread1_post1",
    text: "🧵 Let's talk about building performant React applications. Here's what I've learned after 5 years of production experience...",
    user: SAMPLE_USERS[0],
    isThreadStarter: true,
    threadId: "thread1",
    threadPosition: 1,
    comments: [],
    likes: ["user2", "user3", "user4"],
    retweets: 42,
    createdAt: "2024-03-20T10:00:00.000Z",
  },
  {
    _id: "thread1_post2",
    text: "1/ First, understand that React's virtual DOM isn't magic. It's just a JavaScript object that represents your UI. The real performance gains come from:\n\n- Proper state management\n- Memoization\n- Code splitting",
    user: SAMPLE_USERS[0],
    threadId: "thread1",
    threadPosition: 2,
    comments: [],
    likes: ["user2", "user3"],
    retweets: 38,
    createdAt: "2024-03-20T10:01:00.000Z",
  },
  {
    _id: "thread1_post3",
    text: "2/ Here's a common mistake:\n\nDON'T ❌\nconst [state, setState] = useState(expensiveOperation())\n\nDO ✅\nconst [state, setState] = useState(() => expensiveOperation())\n\nThe second version only runs once during initialization!",
    user: SAMPLE_USERS[0],
    threadId: "thread1",
    threadPosition: 3,
    comments: [
      {
        _id: "comment1",
        text: "This is gold! Wish I knew this earlier 🙌",
        user: SAMPLE_USERS[2],
      },
    ],
    likes: ["user2", "user3", "user4"],
    retweets: 56,
    createdAt: "2024-03-20T10:02:00.000Z",
  },
  {
    _id: "post1",
    text: "Just deployed my first AI-powered app to production! Built with Python, FastAPI, and React. Ask me anything! 🚀",
    img: "/posts/post2.png",
    user: SAMPLE_USERS[2],
    comments: [
      {
        _id: "comment2",
        text: "What was the biggest challenge you faced?",
        user: SAMPLE_USERS[1],
      },
    ],
    likes: ["user1", "user4"],
    retweets: 12,
    createdAt: "2024-03-20T09:30:00.000Z",
  },
  {
    _id: "post2",
    text: "Breaking: Next.js 14 just dropped! The new features are absolutely game-changing for web development:\n\n▪️ Partial Prerendering\n▪️ Server Actions improvements\n▪️ 40% faster local server\n\nTime to upgrade! 🔥",
    user: SAMPLE_USERS[1],
    verified: true,
    comments: [],
    likes: ["user1", "user2", "user3", "user4"],
    retweets: 128,
    createdAt: "2024-03-20T08:45:00.000Z",
  },
];

export const TRENDING_TOPICS = [
  {
    topic: "Technology",
    hashtag: "#NextJS14",
    postCount: "125.4K",
  },
  {
    topic: "Programming",
    hashtag: "#ReactJS",
    postCount: "89.2K",
  },
  {
    topic: "Tech News",
    hashtag: "#AI",
    postCount: "245.8K",
  },
];
