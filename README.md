# 🤖 Create AgentKit App

Create an AI agent powered by Eliza and CDP AgentKit with a single command. This tool helps you quickly set up a powerful conversational AI agent that can be customized for your specific use case.

## 🚀 Quick Start

```bash
npx create-agentkit-app my-agent
cd my-agent
cp .env.example .env
# edit .env file with your own values
pnpm install
pnpm start
```

## ✨ What You Get

Your new AI agent comes with:

- Eliza's powerful conversational capabilities
- CDP AgentKit's robust agent framework
- Multi-client support (Auto, Telegram, Twitter)
- Extensible plugin system
- Built-in caching and database support
- Production-ready infrastructure

## 📋 Requirements

- Node.js 22+
- [CDP API Key](https://portal.cdp.coinbase.com/access/api)

## ⚙️ Configuration

After creating your project, set up your environment variables:

1. Copy `.env.example` to `.env`
2. Set up your environment variables:
   ```env
   CDP_API_KEY_NAME=your_key_name_here
   CDP_API_KEY_PRIVATE_KEY=your_private_key_here
   CDP_AGENT_KIT_NETWORK=base-sepolia  # Optional, defaults to base-sepolia
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
   ```

## 💬 Example Commands

Once running, try these commands:

- "Create an NFT collection for my new single"
- "Deploy a social token for my fan community"
- "Set up a wallet for music royalties"
- "Create a promotional campaign for my latest release"
- "Register an ENS name for my artist profile"

## 🔌 Extending Your Agent

The agent is built with Eliza and AgentKit, giving you access to:

- Customizable character definitions
- Multiple messaging clients
- Extensible plugin system
- Database adapters
- Caching system
- Production deployment tools

## 📄 License

MIT License - Created by sweetman.eth
