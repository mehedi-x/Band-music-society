#!/bin/bash
# 🚀 Speak EU - GitHub Pages Deployment Script

echo "🌍 Speak EU - GitHub Pages Deployment"
echo "======================================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

# Initialize git repository if not exists
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    git branch -M main
fi

# Add all files
echo "📦 Adding files to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "🚀 Deploy Speak EU - European Language Learning App

Features:
- 28 European languages support
- 140,000+ vocabulary entries
- PWA with offline functionality
- Audio pronunciation system
- Progress tracking and achievements
- Bengali interface for Bangladeshi users
- Mobile-responsive design
- Dark/Light theme support

Ready for GitHub Pages deployment!"

# Check if remote origin exists
if ! git remote get-url origin &> /dev/null; then
    echo "🔗 Please add your GitHub repository URL:"
    echo "git remote add origin https://github.com/yourusername/speak-eu.git"
    echo ""
    echo "Then run this script again, or push manually:"
    echo "git push -u origin main"
else
    # Push to GitHub
    echo "📤 Pushing to GitHub..."
    git push -u origin main
    
    echo ""
    echo "✅ Deployment complete!"
    echo ""
    echo "🌐 Your app will be available at:"
    echo "https://yourusername.github.io/speak-eu/"
    echo ""
    echo "📋 Next steps:"
    echo "1. Go to your GitHub repository settings"
    echo "2. Navigate to 'Pages' section"
    echo "3. Select 'Deploy from a branch'"
    echo "4. Choose 'main' branch and '/ (root)' folder"
    echo "5. Click 'Save'"
    echo ""
    echo "🎉 Your Speak EU app will be live in a few minutes!"
fi
