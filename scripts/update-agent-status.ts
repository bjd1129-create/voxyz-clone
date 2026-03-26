#!/usr/bin/env npx ts-node
/**
 * Agent Status Update Script
 *
 * Run by each agent to update their status on the website.
 *
 * Usage:
 *   npx ts-node scripts/update-agent-status.ts <agent-id> <status> <task>
 *
 * Example:
 *   npx ts-node scripts/update-agent-status.ts developer busy "实现新功能"
 */

const WEBSITE_URL = process.env.WEBSITE_URL || 'http://localhost:3000'

async function updateStatus(agentId: string, status: string, task: string | null, activity?: string) {
  const response = await fetch(`${WEBSITE_URL}/api/agents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      agentId,
      status,
      currentTask: task,
      activity: activity || (status === 'busy' ? 'working' : 'walking'),
    }),
  })

  const data = await response.json()
  console.log(`Updated ${agentId}:`, data)
  return data
}

// CLI
const args = process.argv.slice(2)
if (args.length < 2) {
  console.log('Usage: npx ts-node scripts/update-agent-status.ts <agent-id> <status> [task]')
  console.log('Example: npx ts-node scripts/update-agent-status.ts developer busy "实现新功能"')
  process.exit(1)
}

const [agentId, statusArg, ...taskParts] = args
const task = taskParts.length > 0 ? taskParts.join(' ') : null

updateStatus(agentId, statusArg, task).catch(console.error)