#!/bin/bash

# Chess-Mate Setup Script
echo "♟️  Chess-Mate Setup Script"
echo "=========================="
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "   Please install Node.js from https://nodejs.org/"
    echo "   Or use Homebrew: brew install node"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo "✅ npm found: $(npm --version)"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found in backend directory"
    exit 1
fi
npm install
echo "✅ Backend dependencies installed"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found in frontend directory"
    exit 1
fi
npm install
echo "✅ Frontend dependencies installed"
echo ""

# Create .env file if it doesn't exist
cd ../backend
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from example..."
    if [ -f "env.example" ]; then
        cp env.example .env
        echo "✅ .env file created"
        echo "⚠️  Please edit backend/.env and update DATABASE_URL with your database credentials"
    else
        echo "⚠️  env.example not found, creating basic .env..."
        cat > .env << EOF
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/chess_mate?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
EOF
        echo "✅ .env file created"
        echo "⚠️  Please edit backend/.env and update DATABASE_URL with your database credentials"
    fi
else
    echo "✅ .env file already exists"
fi
echo ""

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npm run prisma:generate
echo "✅ Prisma Client generated"
echo ""

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env and set your DATABASE_URL"
echo "2. Run: cd backend && npm run prisma:migrate"
echo "3. Start backend: cd backend && npm run dev"
echo "4. Start frontend: cd frontend && npm run dev"
echo ""
echo "For detailed instructions, see SETUP.md"
