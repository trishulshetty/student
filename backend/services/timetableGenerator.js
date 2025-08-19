import axios from "axios";

export function generateTimetable(subjects, timeSlots, preferences = {}) {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timetable = {};
  
  // Initialize timetable structure
  daysOfWeek.forEach(day => {
    timetable[day] = {};
    timeSlots.forEach(slot => {
      timetable[day][slot] = null;
    });
  });
  
  // Create subject pool with repetitions based on importance/frequency
  const subjectPool = [];
  subjects.forEach(subject => {
    const frequency = subject.frequency || 1; // How many times per week
    for (let i = 0; i < frequency; i++) {
      subjectPool.push(subject);
    }
  });
  
  // Shuffle subjects for random distribution
  const shuffledSubjects = [...subjectPool].sort(() => Math.random() - 0.5);
  
  let subjectIndex = 0;
  
  // Fill timetable
  daysOfWeek.forEach(day => {
    timeSlots.forEach(slot => {
      if (subjectIndex < shuffledSubjects.length) {
        const subject = shuffledSubjects[subjectIndex];
        
        // Check preferences (e.g., avoid certain subjects at certain times)
        if (isSlotSuitable(subject, day, slot, preferences)) {
          timetable[day][slot] = {
            subject: subject.name,
            type: subject.type || 'Study',
            duration: subject.duration || '1 hour',
            priority: subject.priority || 'Medium'
          };
          subjectIndex++;
        }
      }
    });
  });
  
  return timetable;
}

function isSlotSuitable(subject, day, slot, preferences) {
  // Basic logic to avoid scheduling conflicts
  // You can enhance this with more sophisticated rules
  
  // Avoid heavy subjects in early morning or late evening
  if (subject.difficulty === 'Hard' && (slot.includes('6:00') || slot.includes('22:00'))) {
    return false;
  }
  
  // Prefer certain subjects on certain days
  if (preferences.preferredDays && preferences.preferredDays[subject.name]) {
    return preferences.preferredDays[subject.name].includes(day);
  }
  
  return true;
}

export async function pushTimetableToNotion(timetable, studentName) {
  try {
    // First, get database info to understand its structure
    const dbResponse = await axios.get(`https://api.notion.com/v1/databases/${process.env.NOTION_DB_ID}`, {
      headers: {
        Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28"
      }
    });
    
    console.log("Database properties:", Object.keys(dbResponse.data.properties));
    
    // Find the title property
    const titleProperty = Object.entries(dbResponse.data.properties).find(([, prop]) => prop.type === 'title');
    const titlePropertyName = titleProperty ? titleProperty[0] : 'Name';
    
    console.log("Using title property:", titlePropertyName);
    
    // Format timetable as text
    const timetableText = formatTimetableForNotion(timetable);
    
    const response = await axios.post("https://api.notion.com/v1/pages",
      {
        parent: { database_id: process.env.NOTION_DB_ID },
        properties: {
          [titlePropertyName]: { 
            title: [{ text: { content: `📅 Timetable for ${studentName} - ${new Date().toLocaleDateString()}` } }] 
          }
        },
        children: [
          {
            object: "block",
            type: "heading_2",
            heading_2: {
              rich_text: [{ text: { content: `Weekly Timetable for ${studentName}` } }]
            }
          },
          {
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: [{ text: { content: `Generated on: ${new Date().toLocaleString()}` } }]
            }
          },
          {
            object: "block",
            type: "code",
            code: {
              rich_text: [{ text: { content: timetableText } }],
              language: "plain text"
            }
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28"
        }
      }
    );
    
    console.log("✅ Successfully saved timetable to Notion!");
    return response.data;
  } catch (error) {
    console.error("Notion API Error:", error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      throw new Error(`Database not found. Please check: 1) Database ID is correct, 2) Database is shared with your integration`);
    }
    
    throw new Error(`Failed to save timetable to Notion: ${error.response?.data?.message || error.message}`);
  }
}

function formatTimetableForNotion(timetable) {
  let formatted = "WEEKLY TIMETABLE\n";
  formatted += "=".repeat(50) + "\n\n";
  
  Object.entries(timetable).forEach(([day, slots]) => {
    formatted += `${day.toUpperCase()}\n`;
    formatted += "-".repeat(day.length) + "\n";
    
    Object.entries(slots).forEach(([time, subject]) => {
      if (subject) {
        formatted += `${time}: ${subject.subject} (${subject.type})\n`;
      } else {
        formatted += `${time}: Free Time\n`;
      }
    });
    formatted += "\n";
  });
  
  return formatted;
}
