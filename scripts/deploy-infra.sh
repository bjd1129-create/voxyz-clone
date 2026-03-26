#!/bin/bash
# Deployment script for 7x24 automation infrastructure

echo "🚀 Deploying 7x24 Automation Infrastructure"

echo ""
echo "📋 Deployment Checklist:"
echo "1. ✓ Vercel Cron configured in vercel.json for /api/heartbeat"
echo "2. 🔄 Database tables need to be created manually in Supabase"
echo "3. 📤 Push code to Vercel for deployment"
echo "4. ✅ Test heartbeat API after deployment"

echo ""
echo "💾 Database Setup Instructions:"
echo "   1. Go to: https://supabase.com/dashboard/project/krhhfykgnznkesnarbzd/sql/new"
echo "   2. Execute the SQL from: supabase/ops-tables.sql"
echo "   3. This will create all required ops tables and initial configurations"

echo ""
echo "📡 Testing after deployment:"
echo "   curl https://YOUR_VERCEL_APP_URL/api/heartbeat"

echo ""
echo "🔄 Cron schedule: Every 5 minutes (*/5 * * * *)"

echo ""
echo "✅ Deployment prepared. Push to Vercel to activate 7x24 operations."