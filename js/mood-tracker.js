class MoodTracker {
    constructor() {
        this.moods = {
            'great': { emoji: '😊', color: '#4caf50' },
            'good': { emoji: '🙂', color: '#8bc34a' },
            'okay': { emoji: '😐', color: '#ffc107' },
            'down': { emoji: '😔', color: '#ff9800' },
            'awful': { emoji: '😢', color: '#f44336' }
        };
        this.moodHistory = this.loadMoodHistory();
    }

    loadMoodHistory() {
        const saved = localStorage.getItem('moodHistory');
        return saved ? JSON.parse(saved) : [];
    }

    saveMoodHistory() {
        localStorage.setItem('moodHistory', JSON.stringify(this.moodHistory));
    }

    addMoodEntry(mood, note = '') {
        const entry = {
            mood: mood,
            note: note,
            timestamp: new Date().toISOString()
        };
        this.moodHistory.push(entry);
        this.saveMoodHistory();
        this.updateMoodDisplay();
    }

    updateMoodDisplay() {
        const container = document.querySelector('.mood-history');
        if (!container) return;

        container.innerHTML = '';
        
        // Show last 7 days
        const last7Days = this.moodHistory.slice(-7);
        
        last7Days.forEach(entry => {
            const moodData = this.moods[entry.mood];
            const entryDiv = document.createElement('div');
            entryDiv.className = 'mood-entry';
            entryDiv.style.borderColor = moodData.color;
            
            const date = new Date(entry.timestamp);
            entryDiv.innerHTML = `
                <div class="mood-emoji">${moodData.emoji}</div>
                <div class="mood-date">${date.toLocaleDateString()}</div>
                ${entry.note ? `<div class="mood-note">${entry.note}</div>` : ''}
            `;
            
            container.appendChild(entryDiv);
        });
    }

    getAverageMood() {
        if (this.moodHistory.length === 0) return null;
        
        const moodValues = {
            'great': 5,
            'good': 4,
            'okay': 3,
            'down': 2,
            'awful': 1
        };

        const last7Days = this.moodHistory.slice(-7);
        const sum = last7Days.reduce((acc, entry) => acc + moodValues[entry.mood], 0);
        return sum / last7Days.length;
    }
}

// Initialize mood tracker
document.addEventListener('DOMContentLoaded', () => {
    const moodTracker = new MoodTracker();
    
    // Add click handlers for mood buttons
    document.querySelectorAll('.mood-button').forEach(button => {
        button.addEventListener('click', () => {
            const mood = button.dataset.mood;
            const note = document.querySelector('.mood-note-input')?.value || '';
            moodTracker.addMoodEntry(mood, note);
        });
    });
}); 