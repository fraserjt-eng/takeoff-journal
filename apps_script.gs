/**
 * HIGH PERFORMANCE TAKEOFF SYSTEM
 * Google Apps Script for Automation
 *
 * Instructions:
 * 1. Open your Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code and paste this entire file
 * 4. Save the project
 * 5. Deploy as Web App (Deploy > New deployment > Web app)
 * 6. Set "Execute as" to yourself and "Who has access" to "Anyone"
 * 7. Copy the Web App URL to use in the daily_journal.html
 */

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  SPREADSHEET_ID: '', // Leave empty to use active spreadsheet
  DAILY_JOURNAL_SHEET: 'Daily Journal',
  ANALYTICS_SHEET: 'Performance Analytics',
  AI_INSIGHTS_SHEET: 'AI Insights',
  VISION_TRACKER_SHEET: 'Vision Board Tracker',
  WEEKLY_REVIEW_SHEET: 'Weekly Review',
  DASHBOARD_SHEET: 'Executive Dashboard',
  USER_EMAIL: 'joshua.fraser@example.com', // Update with your email
  TIMEZONE: 'America/Chicago'
};

// ============================================
// WEB APP HANDLERS
// ============================================

/**
 * Handle GET requests - Returns status info
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'High Performance Takeoff System API',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle POST requests - Receives journal data from UI
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const result = appendJournalEntry(data);

    // Trigger analytics refresh
    refreshAnalytics();

    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Journal entry saved successfully',
        row: result.row,
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================
// DATA ENTRY FUNCTIONS
// ============================================

/**
 * Append a new journal entry to the Daily Journal sheet
 */
function appendJournalEntry(data) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.DAILY_JOURNAL_SHEET);

  if (!sheet) {
    throw new Error('Daily Journal sheet not found');
  }

  // Build row data array matching the column structure
  const rowData = [
    data.date || new Date().toISOString().split('T')[0],
    data.dayOfWeek || new Date().toLocaleDateString('en-US', { weekday: 'long' }),
    data.weekNumber || getWeekNumber(new Date()),
    data.quarter || 'Q' + Math.ceil((new Date().getMonth() + 1) / 3),
    data.todayMessage || '',
    // Goals
    data.goals?.[0] || '',
    data.goals?.[1] || '',
    data.goals?.[2] || '',
    // Tasks
    data.tasks?.[0]?.text || '',
    data.tasks?.[0]?.completed ? 'Y' : 'N',
    data.tasks?.[1]?.text || '',
    data.tasks?.[1]?.completed ? 'Y' : 'N',
    data.tasks?.[2]?.text || '',
    data.tasks?.[2]?.completed ? 'Y' : 'N',
    // Reach out
    data.reachOut?.[0] || '',
    data.reachOut?.[1] || '',
    data.reachOut?.[2] || '',
    // Prompts (11 prompts)
    ...Array.from({ length: 11 }, (_, i) => data.prompts?.[i]?.response || ''),
    // Habit scores
    data.habits?.clarity || 5,
    data.habits?.energy || 5,
    data.habits?.necessity || 5,
    data.habits?.productivity || 5,
    data.habits?.influence || 5,
    data.habits?.courage || 5,
    // Overall score (calculated)
    `=AVERAGE(AC${sheet.getLastRow() + 1}:AH${sheet.getLastRow() + 1})`,
    // Domain progress
    data.domains?.money?.progress ? 'Y' : 'N',
    data.domains?.health?.progress ? 'Y' : 'N',
    data.domains?.career?.progress ? 'Y' : 'N',
    data.domains?.creative?.progress ? 'Y' : 'N',
    data.domains?.love?.progress ? 'Y' : 'N',
    data.domains?.inner?.progress ? 'Y' : 'N',
    // Domain notes
    data.domains?.money?.notes || '',
    data.domains?.health?.notes || '',
    data.domains?.career?.notes || '',
    data.domains?.creative?.notes || '',
    data.domains?.love?.notes || '',
    data.domains?.inner?.notes || '',
    // Path allocation
    data.pathAllocation || 70,
    // Wins
    data.wins?.[0] || '',
    data.wins?.[1] || '',
    data.wins?.[2] || '',
    // Evening reflection
    data.improvement || '',
    data.gratitude || '',
    data.tomorrowPriority || '',
    // Timestamp
    data.timestamp || new Date().toISOString()
  ];

  // Check if entry for today already exists
  const existingRow = findRowByDate(sheet, data.date);

  if (existingRow) {
    // Update existing row
    sheet.getRange(existingRow, 1, 1, rowData.length).setValues([rowData]);
    return { row: existingRow, updated: true };
  } else {
    // Append new row
    sheet.appendRow(rowData);
    return { row: sheet.getLastRow(), updated: false };
  }
}

/**
 * Find row by date in a sheet
 */
function findRowByDate(sheet, dateStr) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const rowDate = data[i][0];
    if (rowDate instanceof Date) {
      if (Utilities.formatDate(rowDate, CONFIG.TIMEZONE, 'yyyy-MM-dd') === dateStr) {
        return i + 1;
      }
    } else if (rowDate === dateStr) {
      return i + 1;
    }
  }
  return null;
}

// ============================================
// ANALYTICS FUNCTIONS
// ============================================

/**
 * Refresh all analytics calculations
 */
function refreshAnalytics() {
  const ss = getSpreadsheet();

  // Update Performance Analytics
  updatePerformanceTrends(ss);

  // Generate AI Insights
  generateInsights(ss);

  // Update Dashboard
  updateDashboard(ss);

  // Log refresh
  console.log('Analytics refreshed at:', new Date().toISOString());
}

/**
 * Update performance trends in Analytics sheet
 */
function updatePerformanceTrends(ss) {
  const journalSheet = ss.getSheetByName(CONFIG.DAILY_JOURNAL_SHEET);
  const analyticsSheet = ss.getSheetByName(CONFIG.ANALYTICS_SHEET);

  if (!journalSheet || !analyticsSheet) return;

  const journalData = journalSheet.getDataRange().getValues();

  // Get last 30 days of data
  const last30Days = journalData.slice(1).slice(-30);

  // Calculate averages for key metrics
  const metrics = calculateMetrics(last30Days);

  // Update analytics sheet (row 39 onwards based on structure)
  analyticsSheet.getRange('C39').setValue(metrics.averageScore.toFixed(1));
  analyticsSheet.getRange('C40').setValue(metrics.bestHabit);
  analyticsSheet.getRange('C41').setValue(metrics.improvementArea);
  analyticsSheet.getRange('C42').setValue((metrics.consistency * 100).toFixed(0) + '%');
  analyticsSheet.getRange('C43').setValue(metrics.trend);
}

/**
 * Calculate performance metrics from journal data
 */
function calculateMetrics(data) {
  const habitColumns = {
    clarity: 28,    // Column AC (0-indexed: 28)
    energy: 29,     // Column AD
    necessity: 30,  // Column AE
    productivity: 31, // Column AF
    influence: 32,  // Column AG
    courage: 33     // Column AH
  };

  const scores = {
    clarity: [],
    energy: [],
    necessity: [],
    productivity: [],
    influence: [],
    courage: []
  };

  let totalOverall = 0;
  let validDays = 0;

  data.forEach(row => {
    if (row[0]) { // Has date
      Object.keys(habitColumns).forEach(habit => {
        const value = parseFloat(row[habitColumns[habit]]);
        if (!isNaN(value)) {
          scores[habit].push(value);
        }
      });

      // Calculate overall for this row
      const rowScores = Object.keys(habitColumns).map(h => parseFloat(row[habitColumns[h]]) || 0);
      const rowAvg = rowScores.reduce((a, b) => a + b, 0) / rowScores.length;
      if (rowAvg > 0) {
        totalOverall += rowAvg;
        validDays++;
      }
    }
  });

  // Calculate averages
  const habitAverages = {};
  Object.keys(scores).forEach(habit => {
    habitAverages[habit] = scores[habit].length > 0
      ? scores[habit].reduce((a, b) => a + b, 0) / scores[habit].length
      : 0;
  });

  // Find best and worst habits
  const sortedHabits = Object.entries(habitAverages).sort((a, b) => b[1] - a[1]);

  return {
    averageScore: validDays > 0 ? totalOverall / validDays : 0,
    bestHabit: sortedHabits[0]?.[0] || 'N/A',
    improvementArea: sortedHabits[sortedHabits.length - 1]?.[0] || 'N/A',
    consistency: validDays / 30,
    trend: determineTrend(data),
    habitAverages: habitAverages
  };
}

/**
 * Determine performance trend
 */
function determineTrend(data) {
  if (data.length < 7) return 'Insufficient data';

  const recentWeek = data.slice(-7);
  const previousWeek = data.slice(-14, -7);

  const recentAvg = calculateWeekAverage(recentWeek);
  const previousAvg = calculateWeekAverage(previousWeek);

  if (recentAvg > previousAvg + 0.5) return 'Improving';
  if (recentAvg < previousAvg - 0.5) return 'Declining';
  return 'Stable';
}

/**
 * Calculate average score for a week of data
 */
function calculateWeekAverage(weekData) {
  let total = 0;
  let count = 0;

  weekData.forEach(row => {
    const overallCol = 34; // Column AI (0-indexed)
    const value = parseFloat(row[overallCol]);
    if (!isNaN(value)) {
      total += value;
      count++;
    }
  });

  return count > 0 ? total / count : 0;
}

// ============================================
// AI INSIGHTS GENERATOR
// ============================================

/**
 * Generate AI-powered insights based on patterns
 */
function generateInsights(ss) {
  const journalSheet = ss.getSheetByName(CONFIG.DAILY_JOURNAL_SHEET);
  const insightsSheet = ss.getSheetByName(CONFIG.AI_INSIGHTS_SHEET);

  if (!journalSheet || !insightsSheet) return;

  const data = journalSheet.getDataRange().getValues().slice(1);
  const metrics = calculateMetrics(data);

  // Generate personalized recommendations
  const recommendations = generateRecommendations(metrics, data);

  // Update insights sheet
  let row = 5;
  recommendations.forEach(rec => {
    insightsSheet.getRange(`C${row}`).setValue(rec.insight);
    row++;
  });

  // Generate pattern insights
  const patterns = recognizePatterns(data);

  row = 14;
  patterns.forEach(pattern => {
    insightsSheet.getRange(`C${row}`).setValue(pattern);
    row++;
  });
}

/**
 * Generate personalized recommendations based on metrics
 */
function generateRecommendations(metrics, data) {
  const recommendations = [];

  // Performance optimization
  if (metrics.averageScore < 6) {
    recommendations.push({
      category: 'Performance Optimization',
      insight: `Your average score is ${metrics.averageScore.toFixed(1)}. Focus on building consistent habits. Start with small wins each day.`
    });
  } else if (metrics.averageScore < 8) {
    recommendations.push({
      category: 'Performance Optimization',
      insight: `Good performance at ${metrics.averageScore.toFixed(1)}! Push for excellence by focusing on your ${metrics.improvementArea} scores.`
    });
  } else {
    recommendations.push({
      category: 'Performance Optimization',
      insight: `Excellent performance at ${metrics.averageScore.toFixed(1)}! Maintain momentum and help others level up.`
    });
  }

  // Energy management
  const energyAvg = metrics.habitAverages.energy || 5;
  if (energyAvg < 6) {
    recommendations.push({
      category: 'Energy Management',
      insight: 'Your energy levels need attention. Prioritize sleep, nutrition, and exercise. Consider morning routines that boost energy.'
    });
  } else {
    recommendations.push({
      category: 'Energy Management',
      insight: 'Your energy management is solid. Use your high-energy periods for creative work and bold actions.'
    });
  }

  // Leadership effectiveness
  const influenceAvg = metrics.habitAverages.influence || 5;
  if (influenceAvg < 6) {
    recommendations.push({
      category: 'Leadership Effectiveness',
      insight: 'Look for more opportunities to lead and influence. Schedule mentoring conversations and share your knowledge.'
    });
  } else {
    recommendations.push({
      category: 'Leadership Effectiveness',
      insight: 'Your influence is strong! Continue to invest in relationships and look for ways to scale your impact.'
    });
  }

  // Work-life balance
  const pathAllocation = getAveragePathAllocation(data);
  const variance = Math.abs(pathAllocation - 70);
  if (variance > 15) {
    recommendations.push({
      category: 'Work-Life Balance',
      insight: `Your Path A/B split is ${pathAllocation.toFixed(0)}/${(100-pathAllocation).toFixed(0)}. Adjust toward 70/30 for optimal balance.`
    });
  } else {
    recommendations.push({
      category: 'Work-Life Balance',
      insight: `Good balance at ${pathAllocation.toFixed(0)}/${(100-pathAllocation).toFixed(0)}! Keep shipping creative work while maintaining stability.`
    });
  }

  // Goal achievement
  const goalsSet = countGoalsSet(data);
  if (goalsSet < 0.7) {
    recommendations.push({
      category: 'Goal Achievement',
      insight: 'You\'re not consistently setting daily goals. Start each morning by defining your top 3 priorities.'
    });
  } else {
    recommendations.push({
      category: 'Goal Achievement',
      insight: 'Great job setting daily goals! Focus on completing your #1 priority before anything else.'
    });
  }

  // Courage and bold action
  const courageAvg = metrics.habitAverages.courage || 5;
  if (courageAvg < 6) {
    recommendations.push({
      category: 'Bold Action',
      insight: 'Take more bold actions! Each day, identify one thing that scares you and do it anyway.'
    });
  } else {
    recommendations.push({
      category: 'Bold Action',
      insight: 'Your courage is admirable! Keep pushing boundaries and inspire others to do the same.'
    });
  }

  return recommendations;
}

/**
 * Recognize patterns in the data
 */
function recognizePatterns(data) {
  const patterns = [];

  // Best day of week
  const dayScores = { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: [] };
  data.forEach(row => {
    const dayOfWeek = row[1];
    const overall = parseFloat(row[34]) || 0;
    if (dayOfWeek && dayScores[dayOfWeek] !== undefined && overall > 0) {
      dayScores[dayOfWeek].push(overall);
    }
  });

  let bestDay = 'Monday';
  let bestAvg = 0;
  Object.entries(dayScores).forEach(([day, scores]) => {
    if (scores.length > 0) {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (avg > bestAvg) {
        bestAvg = avg;
        bestDay = day;
      }
    }
  });
  patterns.push(`Best Performance Day: ${bestDay} (avg: ${bestAvg.toFixed(1)})`);

  // Domain focus
  const domainProgress = { money: 0, health: 0, career: 0, creative: 0, love: 0, inner: 0 };
  const domainColumns = { money: 35, health: 36, career: 37, creative: 38, love: 39, inner: 40 };

  data.forEach(row => {
    Object.entries(domainColumns).forEach(([domain, col]) => {
      if (row[col] === 'Y' || row[col] === true) {
        domainProgress[domain]++;
      }
    });
  });

  const sortedDomains = Object.entries(domainProgress).sort((a, b) => b[1] - a[1]);
  patterns.push(`Most Focused Domain: ${sortedDomains[0][0]} (${sortedDomains[0][1]} days)`);
  patterns.push(`Needs More Focus: ${sortedDomains[sortedDomains.length - 1][0]} (${sortedDomains[sortedDomains.length - 1][1]} days)`);

  // Consistency streak
  let currentStreak = 0;
  let maxStreak = 0;
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i][0]) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      break;
    }
  }
  patterns.push(`Current Streak: ${currentStreak} days`);

  // Energy-productivity correlation
  const energyProductivity = calculateCorrelation(
    data.map(r => parseFloat(r[29]) || 0),
    data.map(r => parseFloat(r[31]) || 0)
  );
  patterns.push(`Energy-Productivity Correlation: ${(energyProductivity * 100).toFixed(0)}%`);

  return patterns;
}

/**
 * Calculate correlation between two arrays
 */
function calculateCorrelation(arr1, arr2) {
  const n = Math.min(arr1.length, arr2.length);
  if (n < 2) return 0;

  const mean1 = arr1.reduce((a, b) => a + b, 0) / n;
  const mean2 = arr2.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denom1 = 0;
  let denom2 = 0;

  for (let i = 0; i < n; i++) {
    const diff1 = arr1[i] - mean1;
    const diff2 = arr2[i] - mean2;
    numerator += diff1 * diff2;
    denom1 += diff1 * diff1;
    denom2 += diff2 * diff2;
  }

  const denominator = Math.sqrt(denom1 * denom2);
  return denominator === 0 ? 0 : numerator / denominator;
}

/**
 * Get average path allocation from data
 */
function getAveragePathAllocation(data) {
  const pathCol = 46; // Column AV (0-indexed)
  let total = 0;
  let count = 0;

  data.forEach(row => {
    const value = parseFloat(row[pathCol]);
    if (!isNaN(value)) {
      total += value;
      count++;
    }
  });

  return count > 0 ? total / count : 70;
}

/**
 * Count percentage of days with goals set
 */
function countGoalsSet(data) {
  let withGoals = 0;
  let total = 0;

  data.forEach(row => {
    if (row[0]) { // Has date
      total++;
      if (row[5] || row[6] || row[7]) { // Has at least one goal
        withGoals++;
      }
    }
  });

  return total > 0 ? withGoals / total : 0;
}

// ============================================
// WEEKLY REPORT GENERATOR
// ============================================

/**
 * Generate weekly report - triggered by time-driven trigger
 */
function generateWeeklyReport() {
  const ss = getSpreadsheet();
  const journalSheet = ss.getSheetByName(CONFIG.DAILY_JOURNAL_SHEET);
  const weeklySheet = ss.getSheetByName(CONFIG.WEEKLY_REVIEW_SHEET);

  if (!journalSheet || !weeklySheet) return;

  const data = journalSheet.getDataRange().getValues().slice(1);
  const thisWeekData = data.filter(row => {
    const rowDate = new Date(row[0]);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return rowDate >= weekAgo;
  });

  const metrics = calculateMetrics(thisWeekData);

  // Update weekly review sheet
  weeklySheet.getRange('C4').setValue(getWeekNumber(new Date()));

  // Update habit scores table (rows 16-22, columns C-I for days)
  const habits = ['clarity', 'energy', 'necessity', 'productivity', 'influence', 'courage'];
  const habitCols = [28, 29, 30, 31, 32, 33];

  // Populate daily scores for each habit
  habits.forEach((habit, habitIndex) => {
    thisWeekData.forEach((row, dayIndex) => {
      if (dayIndex < 7) {
        const value = parseFloat(row[habitCols[habitIndex]]) || '';
        weeklySheet.getRange(16 + habitIndex, 3 + dayIndex).setValue(value);
      }
    });
  });

  // Generate insight
  weeklySheet.getRange('C26').setValue(
    metrics.averageScore >= 7
      ? 'Strong week! Focus on maintaining momentum and pushing boundaries.'
      : 'Room for growth. Identify what\'s blocking your performance and address it.'
  );

  // Send email summary if configured
  if (CONFIG.USER_EMAIL) {
    sendWeeklyEmail(metrics, thisWeekData);
  }
}

/**
 * Send weekly email summary
 */
function sendWeeklyEmail(metrics, data) {
  const subject = `TAKEOFF Weekly Report - Week ${getWeekNumber(new Date())}`;

  const body = `
HIGH PERFORMANCE TAKEOFF SYSTEM
Weekly Report - Week ${getWeekNumber(new Date())}

PERFORMANCE SUMMARY
-------------------
Average Score: ${metrics.averageScore.toFixed(1)}/10
Trend: ${metrics.trend}
Consistency: ${(metrics.consistency * 100).toFixed(0)}%

TOP PERFORMING HABIT: ${metrics.bestHabit}
IMPROVEMENT AREA: ${metrics.improvementArea}

HABIT BREAKDOWN
---------------
Clarity: ${metrics.habitAverages.clarity?.toFixed(1) || 'N/A'}
Energy: ${metrics.habitAverages.energy?.toFixed(1) || 'N/A'}
Necessity: ${metrics.habitAverages.necessity?.toFixed(1) || 'N/A'}
Productivity: ${metrics.habitAverages.productivity?.toFixed(1) || 'N/A'}
Influence: ${metrics.habitAverages.influence?.toFixed(1) || 'N/A'}
Courage: ${metrics.habitAverages.courage?.toFixed(1) || 'N/A'}

RECOMMENDATIONS
---------------
${metrics.averageScore < 7
  ? '- Focus on your weakest habit area this week\n- Set specific, achievable daily goals\n- Prioritize energy management'
  : '- Push for excellence in all areas\n- Help others level up\n- Take more bold actions'}

Keep shipping! The becoming is the point.

---
Generated by TAKEOFF System
  `;

  try {
    MailApp.sendEmail(CONFIG.USER_EMAIL, subject, body);
    console.log('Weekly email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// ============================================
// DASHBOARD UPDATE
// ============================================

/**
 * Update Executive Dashboard
 */
function updateDashboard(ss) {
  const dashboardSheet = ss.getSheetByName(CONFIG.DASHBOARD_SHEET);
  const journalSheet = ss.getSheetByName(CONFIG.DAILY_JOURNAL_SHEET);

  if (!dashboardSheet || !journalSheet) return;

  const data = journalSheet.getDataRange().getValues().slice(1);
  const metrics = calculateMetrics(data.slice(-30));

  // Update date
  dashboardSheet.getRange('B4').setValue(`Date: ${new Date().toLocaleDateString()}`);
  dashboardSheet.getRange('C4').setValue(`Week: ${getWeekNumber(new Date())}`);
  dashboardSheet.getRange('D4').setValue(`Q${Math.ceil((new Date().getMonth() + 1) / 3)}`);

  // Update metrics (rows 7-12)
  dashboardSheet.getRange('C7').setValue(`${metrics.averageScore.toFixed(1)}`);
  dashboardSheet.getRange('C12').setValue(metrics.trend === 'Improving' ? 'Rising' : metrics.trend === 'Declining' ? 'Falling' : 'Stable');
}

// ============================================
// CUSTOM MENU
// ============================================

/**
 * Create custom menu when spreadsheet opens
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('TAKEOFF System')
    .addItem('Go to Dashboard', 'goToDashboard')
    .addItem('Go to Daily Journal', 'goToDailyJournal')
    .addItem('Go to Analytics', 'goToAnalytics')
    .addItem('Go to AI Insights', 'goToAIInsights')
    .addSeparator()
    .addItem('Refresh All Data', 'refreshAnalytics')
    .addItem('Generate Weekly Report', 'generateWeeklyReport')
    .addSeparator()
    .addItem('Export All Data', 'exportAllData')
    .addItem('System Settings', 'showSettings')
    .addToUi();
}

/**
 * Navigation functions
 */
function goToDashboard() {
  const ss = getSpreadsheet();
  ss.setActiveSheet(ss.getSheetByName(CONFIG.DASHBOARD_SHEET));
}

function goToDailyJournal() {
  const ss = getSpreadsheet();
  ss.setActiveSheet(ss.getSheetByName(CONFIG.DAILY_JOURNAL_SHEET));
}

function goToAnalytics() {
  const ss = getSpreadsheet();
  ss.setActiveSheet(ss.getSheetByName(CONFIG.ANALYTICS_SHEET));
}

function goToAIInsights() {
  const ss = getSpreadsheet();
  ss.setActiveSheet(ss.getSheetByName(CONFIG.AI_INSIGHTS_SHEET));
}

/**
 * Export all data to JSON
 */
function exportAllData() {
  const ss = getSpreadsheet();
  const journalSheet = ss.getSheetByName(CONFIG.DAILY_JOURNAL_SHEET);
  const data = journalSheet.getDataRange().getValues();

  const headers = data[0];
  const rows = data.slice(1);

  const exportData = rows.map(row => {
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj;
  });

  const json = JSON.stringify(exportData, null, 2);

  // Create a new document with the export
  const doc = DocumentApp.create('TAKEOFF Export - ' + new Date().toISOString().split('T')[0]);
  doc.getBody().setText(json);

  const ui = SpreadsheetApp.getUi();
  ui.alert('Export Complete', `Data exported to: ${doc.getUrl()}`, ui.ButtonSet.OK);
}

/**
 * Show settings dialog
 */
function showSettings() {
  const html = HtmlService.createHtmlOutput(`
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      h2 { color: #d4a853; }
      p { color: #666; }
      .setting { margin: 15px 0; }
      label { display: block; margin-bottom: 5px; font-weight: bold; }
      input { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
      button { background: #d4a853; color: #0a1628; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-top: 20px; }
      button:hover { background: #e5b95f; }
    </style>
    <h2>TAKEOFF System Settings</h2>
    <div class="setting">
      <label>User Email</label>
      <input type="email" id="email" value="${CONFIG.USER_EMAIL}" placeholder="your@email.com">
    </div>
    <div class="setting">
      <label>Timezone</label>
      <input type="text" id="timezone" value="${CONFIG.TIMEZONE}" placeholder="America/Chicago">
    </div>
    <p>Note: Settings are stored in the script. Contact developer to update.</p>
    <button onclick="google.script.host.close()">Close</button>
  `)
  .setWidth(400)
  .setHeight(300);

  SpreadsheetApp.getUi().showModalDialog(html, 'System Settings');
}

// ============================================
// TIME-DRIVEN TRIGGERS
// ============================================

/**
 * Set up time-driven triggers (run once to initialize)
 */
function setupTriggers() {
  // Clear existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));

  // Weekly report - Sunday at 8 PM
  ScriptApp.newTrigger('generateWeeklyReport')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.SUNDAY)
    .atHour(20)
    .create();

  // Daily analytics refresh - every day at 11 PM
  ScriptApp.newTrigger('refreshAnalytics')
    .timeBased()
    .everyDays(1)
    .atHour(23)
    .create();

  console.log('Triggers set up successfully');
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get spreadsheet (active or by ID)
 */
function getSpreadsheet() {
  if (CONFIG.SPREADSHEET_ID) {
    return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Get ISO week number
 */
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

/**
 * Format date for display
 */
function formatDate(date, format) {
  return Utilities.formatDate(date, CONFIG.TIMEZONE, format || 'yyyy-MM-dd');
}

// ============================================
// TESTING FUNCTIONS
// ============================================

/**
 * Test function to verify everything works
 */
function testSystem() {
  console.log('Testing TAKEOFF System...');

  const ss = getSpreadsheet();
  console.log('Spreadsheet name:', ss.getName());

  const sheets = ss.getSheets().map(s => s.getName());
  console.log('Available sheets:', sheets.join(', '));

  console.log('Week number:', getWeekNumber(new Date()));
  console.log('Quarter:', Math.ceil((new Date().getMonth() + 1) / 3));

  console.log('Test complete!');
}

/**
 * Add sample data for testing
 */
function addSampleData() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.DAILY_JOURNAL_SHEET);

  // Add 7 days of sample data
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const sampleEntry = {
      date: date.toISOString().split('T')[0],
      dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'long' }),
      weekNumber: getWeekNumber(date),
      quarter: 'Q' + Math.ceil((date.getMonth() + 1) / 3),
      todayMessage: 'Sample message for day ' + (7 - i),
      goals: ['Goal 1', 'Goal 2', 'Goal 3'],
      tasks: [
        { text: 'Task 1', completed: Math.random() > 0.5 },
        { text: 'Task 2', completed: Math.random() > 0.5 },
        { text: 'Task 3', completed: Math.random() > 0.5 }
      ],
      reachOut: ['Person 1', 'Person 2', ''],
      prompts: Array.from({ length: 11 }, (_, j) => ({ response: `Response ${j + 1}` })),
      habits: {
        clarity: Math.floor(Math.random() * 4) + 6,
        energy: Math.floor(Math.random() * 4) + 5,
        necessity: Math.floor(Math.random() * 4) + 6,
        productivity: Math.floor(Math.random() * 4) + 5,
        influence: Math.floor(Math.random() * 4) + 5,
        courage: Math.floor(Math.random() * 4) + 5
      },
      domains: {
        money: { progress: Math.random() > 0.5, notes: '' },
        health: { progress: Math.random() > 0.5, notes: '' },
        career: { progress: Math.random() > 0.5, notes: '' },
        creative: { progress: Math.random() > 0.5, notes: '' },
        love: { progress: Math.random() > 0.5, notes: '' },
        inner: { progress: Math.random() > 0.5, notes: '' }
      },
      pathAllocation: 65 + Math.floor(Math.random() * 15),
      wins: ['Win 1', 'Win 2', 'Win 3'],
      improvement: 'Could improve on focus',
      gratitude: 'Grateful for progress',
      tomorrowPriority: 'Ship something'
    };

    appendJournalEntry(sampleEntry);
  }

  console.log('Sample data added!');
  refreshAnalytics();
}
