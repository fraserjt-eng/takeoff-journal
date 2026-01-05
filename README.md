# HIGH PERFORMANCE TAKEOFF SYSTEM

**"The becoming is the point."** - Joshua Fraser, Ed.D.

A comprehensive daily journaling and performance tracking system based on Brendon Burchard's High Performance Habits framework, designed to help you achieve your 2026 Vision Board goals.

---

## Table of Contents

1. [Overview](#overview)
2. [System Components](#system-components)
3. [Quick Start Guide](#quick-start-guide)
4. [Detailed Setup Instructions](#detailed-setup-instructions)
5. [Daily Workflow](#daily-workflow)
6. [Weekly Review Process](#weekly-review-process)
7. [Monthly Review Process](#monthly-review-process)
8. [Understanding the Dashboard](#understanding-the-dashboard)
9. [AI Insights Explained](#ai-insights-explained)
10. [Troubleshooting](#troubleshooting)
11. [Customization](#customization)

---

## Overview

The TAKEOFF System tracks progress across six life domains aligned with your 2026 Vision Board:

| Domain | North Star Goal | Path |
|--------|-----------------|------|
| Money & Finance | $15K/month revenue | A |
| Health & Fitness | 3x/week training, 185-197 lbs | B |
| Career/BCCS | Excellence + Legacy Systems | B |
| Creative Ventures | 4 books, 5K followers | A |
| Love & Relationship | 12 date nights, presence | B |
| Inner Peace | Daily practice, the spiral continues | B |

**Path Allocation Target:** 70% Path A (SHIP IT!) / 30% Path B (Stability)

---

## System Components

### Files Included

```
TakeoffSystem/
   daily_journal.html      # Browser-based daily entry UI
   High_Performance_Takeoff_Tracker.xlsx  # Excel/Google Sheets template
   apps_script.gs          # Google Apps Script automation code
   README.md               # This documentation
   create_spreadsheet.py   # Python script used to generate Excel file
```

### Spreadsheet Tabs

1. **Executive Dashboard** - At-a-glance performance metrics
2. **Daily Journal** - Raw data storage for all entries
3. **Performance Analytics** - Trends and calculations
4. **AI Insights** - Automated recommendations
5. **Vision Board Tracker** - Progress toward 2026 goals
6. **Weekly Review** - Weekly reflection template
7. **Monthly Review** - Monthly analysis template
8. **Settings & Reference** - Configuration and scoring guide

---

## Quick Start Guide

### 5-Minute Setup

1. **Upload to Google Sheets**
   - Go to [Google Sheets](https://sheets.google.com)
   - File > Import > Upload `High_Performance_Takeoff_Tracker.xlsx`
   - Choose "Replace spreadsheet" or "Create new spreadsheet"

2. **Add Apps Script**
   - In Google Sheets: Extensions > Apps Script
   - Delete default code
   - Copy/paste contents of `apps_script.gs`
   - Save (Ctrl+S)

3. **Deploy as Web App**
   - Click "Deploy" > "New deployment"
   - Select type: "Web app"
   - Execute as: "Me"
   - Who has access: "Anyone"
   - Click "Deploy"
   - Authorize when prompted
   - **Copy the Web App URL**

4. **Configure the Journal UI**
   - Open `daily_journal.html` in your browser
   - Click "Settings" button at bottom
   - Paste the Web App URL
   - Click "Save Settings"

5. **Start Journaling!**

---

## Detailed Setup Instructions

### Step 1: Prepare Google Sheets

1. Open [Google Drive](https://drive.google.com)
2. Click "New" > "File upload"
3. Select `High_Performance_Takeoff_Tracker.xlsx`
4. Once uploaded, right-click > "Open with" > "Google Sheets"
5. File > "Save as Google Sheets" (optional but recommended)

### Step 2: Install Apps Script

1. With your spreadsheet open, go to **Extensions > Apps Script**
2. This opens the script editor in a new tab
3. Select all existing code and delete it
4. Open `apps_script.gs` in a text editor
5. Copy ALL the code (Ctrl+A, Ctrl+C)
6. Paste into the Apps Script editor (Ctrl+V)
7. Click the floppy disk icon or press Ctrl+S to save
8. Name your project "TAKEOFF System"

### Step 3: Configure Settings in Apps Script

Find the CONFIG section at the top of the script:

```javascript
const CONFIG = {
  SPREADSHEET_ID: '', // Leave empty to use active spreadsheet
  DAILY_JOURNAL_SHEET: 'Daily Journal',
  USER_EMAIL: 'your.email@example.com', // Update this!
  TIMEZONE: 'America/Chicago'
};
```

Update `USER_EMAIL` with your actual email to receive weekly reports.

### Step 4: Deploy as Web App

1. In Apps Script, click **Deploy > New deployment**
2. Click the gear icon next to "Select type" and choose **Web app**
3. Fill in:
   - Description: "TAKEOFF Journal API v1.0"
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. Click **Authorize access** and follow the prompts
   - Choose your Google account
   - Click "Advanced" > "Go to TAKEOFF System (unsafe)"
   - Click "Allow"
6. **Copy the Web App URL** - you'll need this!

### Step 5: Set Up Automated Triggers

1. In Apps Script, click the clock icon (Triggers) in the left sidebar
2. Click **+ Add Trigger**
3. Set up Weekly Report trigger:
   - Function: `generateWeeklyReport`
   - Event source: Time-driven
   - Type: Week timer
   - Day: Sunday
   - Time: 8pm-9pm
4. Add another trigger for daily analytics:
   - Function: `refreshAnalytics`
   - Event source: Time-driven
   - Type: Day timer
   - Time: 11pm-midnight

### Step 6: Configure the HTML Journal

1. Open `daily_journal.html` in any modern web browser
2. Click the **Settings** button at the bottom of the page
3. Paste your Web App URL from Step 4
4. Set auto-save interval (default: 30 seconds)
5. Click **Save Settings**

### Step 7: Test the Connection

1. Fill in a few fields in the journal
2. Click **Submit to Spreadsheet**
3. Check your Google Sheet - a new row should appear in "Daily Journal" tab

---

## Daily Workflow

### Morning Routine (5-10 minutes)

1. **Open the Journal**
   - Open `daily_journal.html` in your browser
   - Or bookmark it for quick access

2. **Complete Section 1: Performance Snapshot**
   - Write today's message to yourself
   - Set your Top 3 Goals
   - Identify Must-Do Tasks
   - List people to reach out to

3. **Complete Section 2: Morning Mindset**
   - Work through all 11 Brendon Burchard prompts
   - Be honest and thoughtful in your responses
   - Expand/collapse prompts as needed

4. **Plan Your Schedule**
   - Map out your day in 30-minute blocks
   - Tag each block with a domain
   - Focus on Path A activities (70%)

### Throughout the Day

- Check off tasks as completed
- Return to update schedule if needed
- Draft saved automatically every 30 seconds

### Evening Routine (5 minutes)

1. **Rate Your Habits (Section 4)**
   - Clarity: Did I know my goals?
   - Energy: Did I manage my energy?
   - Necessity: Did I feel urgency?
   - Productivity: Did I focus on impact?
   - Influence: Did I positively influence others?
   - Courage: Did I take bold action?

2. **Vision Board Check-in (Section 5)**
   - Toggle which domains you made progress in
   - Add notes for significant activities
   - Estimate your Path A/B split

3. **Evening Reflection (Section 6)**
   - Record 3 wins from today
   - Note 1 thing you could improve
   - Write what you're grateful for
   - Set tomorrow's #1 priority

4. **Submit**
   - Click "Submit to Spreadsheet"
   - Verify the toast notification shows success

---

## Weekly Review Process

**When:** Sunday evening (8 PM recommended)

### Steps:

1. Go to the **Weekly Review** tab in Google Sheets
2. Update the week number if needed
3. Review the auto-populated habit scores
4. Fill in:
   - **Weekly Wins (Top 3)** - What went well?
   - **Weekly Challenges** - What was difficult?
   - **Commitment for Next Week** - What will you focus on?
5. Review the generated insights
6. Check your email for the weekly report summary

### What to Look For:

- Which habits scored lowest? These are growth opportunities.
- Which day performed best? Replicate those conditions.
- Is your Path A/B split close to 70/30?
- Are you making progress across all domains?

---

## Monthly Review Process

**When:** First of each month

### Steps:

1. Go to the **Monthly Review** tab
2. Select the month being reviewed
3. Review the Monthly Scorecard:
   - Average daily performance
   - Consistency (days completed)
   - Best week
   - Improvement from last month
4. Check Domain Progress against targets
5. Document:
   - **Wins of the Month** - Major accomplishments
   - **Focus Areas** - Based on AI recommendations
6. Go to **Vision Board Tracker** and update:
   - Current status for each domain
   - Progress percentages
   - Notes on specific achievements

---

## Understanding the Dashboard

### Performance Snapshot Section

| Metric | What It Measures |
|--------|------------------|
| Daily Performance Score | Average of all 6 habit scores |
| Energy Level | Your energy rating for the day |
| Weekly Goals Progress | % of days with goals completed |
| Leadership Impact | Your influence score |
| Work-Life Balance | How close to 70/30 Path split |
| Trend | Rising/Falling/Stable vs last week |

### AI Insights Section

The dashboard pulls top recommendations from the AI Insights tab, showing the most relevant advice based on your recent patterns.

---

## AI Insights Explained

The system analyzes your data to provide:

### Personalized Recommendations

- **Performance Optimization** - Based on your average score
- **Stress Management** - Based on energy levels
- **Leadership Effectiveness** - Based on influence scores
- **Work-Life Balance** - Based on Path allocation
- **Energy Management** - Correlating energy with other habits
- **Goal Achievement** - Based on goal-setting consistency

### Pattern Recognition

- **Best Performance Days** - Which day of week you perform best
- **Domain Focus** - Which areas get most/least attention
- **Streaks** - How many consecutive days you've journaled
- **Correlations** - Relationships between habits (e.g., energy vs productivity)

### How Insights Are Generated

Insights use formulas based on:
- Last 30 days of journal data
- Habit score averages and trends
- Domain progress patterns
- Path allocation variance

---

## Troubleshooting

### "Data not appearing in spreadsheet"

1. Check the Web App URL in Settings is correct
2. Ensure the Web App is deployed with "Anyone" access
3. Try reauthorizing the Apps Script
4. Check for errors in Apps Script (View > Execution log)

### "Formulas showing errors"

1. Ensure sheet names match exactly (case-sensitive)
2. Make sure there's at least one row of data
3. Go to Settings tab, verify column references

### "Weekly email not arriving"

1. Check spam folder
2. Verify email in CONFIG section of Apps Script
3. Ensure trigger is set up correctly
4. Check execution log for errors

### "Insights are empty"

- The system needs at least 7 days of data to generate insights
- Keep journaling consistently!

### "Can't deploy Apps Script"

1. Make sure you're signed into the correct Google account
2. Try incognito window if caching issues
3. Check that you've authorized all required permissions

---

## Customization

### Changing Domain Targets

1. Go to **Vision Board Tracker** tab
2. Edit the "Target" column for each domain
3. Update notes as needed

### Modifying Prompts

1. Open `daily_journal.html` in a text editor
2. Find the `morningPrompts` array
3. Edit prompt text as desired
4. Save and refresh the browser

### Adjusting Scoring Thresholds

In the Settings tab, the scoring reference shows:
- 1-4: Needs Work (Red)
- 5-6: Making Progress (Yellow)
- 7-8: On Track (Green)
- 9-10: Exceptional (Gold)

To adjust colors in the HTML, modify the CSS variables in the `<style>` section.

### Adding New Domains

This requires editing:
1. The `domains` array in `daily_journal.html`
2. Column structure in the Daily Journal sheet
3. Apps Script `appendJournalEntry` function
4. Vision Board Tracker tab

### Changing Path Allocation Target

1. In Settings tab, update the target description
2. In the HTML, modify the default slider value (currently 70)
3. Adjust insight formulas if needed

---

## Best Practices

### For Maximum Benefit:

1. **Journal every day** - Consistency beats intensity
2. **Be honest** - Rate yourself accurately, not optimistically
3. **Review weekly** - The patterns matter more than single days
4. **Act on insights** - Use recommendations to improve
5. **Celebrate wins** - Acknowledge progress, no matter how small

### The High Performance Habits (Brendon Burchard):

1. **Seek Clarity** - Know who you want to be and what you want
2. **Generate Energy** - Take care of your mind and body
3. **Raise Necessity** - Create urgency and importance
4. **Increase Productivity** - Focus on outputs that matter
5. **Develop Influence** - Lead and inspire others
6. **Demonstrate Courage** - Take bold action despite fear

---

## Support

This system was built for personal use. For modifications or technical support:
- Review the code comments in `apps_script.gs`
- Check the formulas in the spreadsheet
- Refer to [Google Apps Script documentation](https://developers.google.com/apps-script)

---

**Remember: The becoming is the point.**

Every day you show up and do the work, you're becoming who you want to be.

TAKEOFF!

---

*Created for Joshua Fraser, Ed.D. | 2026 Vision Board System*
*Based on High Performance Habits by Brendon Burchard*
