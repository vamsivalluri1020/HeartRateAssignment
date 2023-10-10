import fs from 'fs';
import moment from 'moment';
import _ from 'lodash';

// Read the input JSON data
const rawData = fs.readFileSync('input.json', 'utf8');
const data: any[] = JSON.parse(rawData);

// Initialize an object to store the statistics
const stats: { [key: string]: any } = {};

// Process the data
data.forEach((entry: any) => {
  const date = moment(entry.timestamps.startTime).format('YYYY-MM-DD');
  if (!stats[date]) {
    stats[date] = {
      min: entry.beatsPerMinute,
      max: entry.beatsPerMinute,
      sum: entry.beatsPerMinute,
      count: 1,
      latestDataTimestamp: entry.timestamps.endTime,
    };
  } else {
    stats[date].min = Math.min(stats[date].min, entry.beatsPerMinute);
    stats[date].max = Math.max(stats[date].max, entry.beatsPerMinute);
    stats[date].sum += entry.beatsPerMinute;
    stats[date].count += 1;
    if (entry.timestamps.endTime > stats[date].latestDataTimestamp) {
      stats[date].latestDataTimestamp = entry.timestamps.endTime;
    }
  }
});

// Calculate the median for each date
for (const date in stats) {
  const { count, sum } = stats[date];
  stats[date].median = sum / count;
}

// Transform the result into an array of objects
const result = Object.keys(stats).map(date => ({
  date,
  ...stats[date],
}));

// Write the output to the output JSON file
fs.writeFileSync('output.json', JSON.stringify(result, null, 2));
