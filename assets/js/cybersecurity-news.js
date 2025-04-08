/**
 * CyberGuard - Cybersecurity News API
 * Fetches latest cybersecurity news from HackerNews API
 */

// Fetch cybersecurity news
async function fetchCyberSecurityNews() {
    try {
        // Get top stories
        const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        const storyIds = await response.json();
        
        // Get the first 30 articles 
        const topIds = storyIds.slice(0, 30);
        
        // Get details for each story
        const storyPromises = topIds.map(id => 
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
            .then(res => res.json())
        );
        
        let stories = await Promise.all(storyPromises);
        
        // Filter only for cybersecurity-related articles
        const securityKeywords = ['security', 'hack', 'breach', 'cyber', 'vulnerability', 
                               'password', 'privacy', 'phishing', 'malware', 'ransomware',
                               'encryption', 'attack', 'threat', 'data leak', 'exploit'];
        
        stories = stories.filter(story => {
            if (!story || !story.title) return false;
            return securityKeywords.some(keyword => 
                story.title.toLowerCase().includes(keyword) || 
                (story.text && story.text.toLowerCase().includes(keyword))
            );
        });
        
        // If there aren't enough security news, add tech news
        if (stories.length < 3) {
            const moreIds = storyIds.slice(30, 80);
            const moreStoryPromises = moreIds.map(id => 
                fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
                .then(res => res.json())
            );
            
            const additionalStories = await Promise.all(moreStoryPromises);
            const techKeywords = ['tech', 'data', 'software', 'hardware', 'computer', 'network'];
            
            const filteredAdditional = additionalStories.filter(story => {
                if (!story || !story.title) return false;
                return techKeywords.some(keyword => 
                    story.title.toLowerCase().includes(keyword) || 
                    (story.text && story.text.toLowerCase().includes(keyword))
                );
            });
            
            stories = stories.concat(filteredAdditional);
        }
        
        // Return the first 6 articles
        return stories.slice(0, 6);
    } catch (error) {
        console.error('Error fetching cybersecurity news:', error);
        return [];
    }
}

// Create HTML card for a news item
function createNewsCard(item) {
    if (!item) return '';
    
    const date = new Date(item.time * 1000).toLocaleDateString();
    const url = item.url || `https://news.ycombinator.com/item?id=${item.id}`;
    
    // Determine tag based on keywords
    let tagText = "NEWS";
    let tagClass = "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
    
    if (item.title.toLowerCase().includes('hack') || 
        item.title.toLowerCase().includes('breach') || 
        item.title.toLowerCase().includes('attack')) {
        tagText = "ALERT";
        tagClass = "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
    } else if (item.title.toLowerCase().includes('security') || 
              item.title.toLowerCase().includes('vulnerability') || 
              item.title.toLowerCase().includes('cyber')) {
        tagText = "SECURITY";
        tagClass = "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
    }
    
    return `
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow news-card">
        <div class="p-6">
            <span class="inline-block ${tagClass} text-xs font-medium px-2.5 py-0.5 rounded-full mb-2">${tagText}</span>
            <h3 class="text-xl font-bold mb-2">${item.title}</h3>
            <p class="text-slate-600 dark:text-slate-300 mb-4">Source: Hacker News</p>
            <div class="flex justify-between items-center">
                <span class="text-sm text-slate-500 dark:text-slate-400">${date}</span>
                <a href="${url}" target="_blank" class="text-primary hover:text-blue-700 font-medium">Read More</a>
            </div>
        </div>
    </div>
    `;
}

// Display news in the page
function displayCyberSecurityNews(newsItems, containerId) {
    const newsContainer = document.getElementById(containerId);
    if (!newsContainer) return;
    
    if (newsItems.length === 0) {
        newsContainer.innerHTML = `
            <div class="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
                <p class="text-center text-slate-600 dark:text-slate-300">
                    No cybersecurity news available at the moment. Please check back later.
                </p>
            </div>
        `;
        return;
    }
    
    let newsHTML = '';
    newsItems.forEach(item => {
        newsHTML += createNewsCard(item);
    });
    
    newsContainer.innerHTML = newsHTML;
}

// Load news when the page is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the main news page
    const newsPageContainer = document.getElementById('cybersecurity-news-container');
    
    // Check if we're on the home page
    const homePageContainer = document.getElementById('home-news-container');
    
    if (newsPageContainer || homePageContainer) {
        // Get the news
        fetchCyberSecurityNews().then(news => {
            // If we're on the news page, show all news
            if (newsPageContainer) {
                displayCyberSecurityNews(news, 'cybersecurity-news-container');
            }
            
            // If we're on the home page, show only the first 3 news
            if (homePageContainer) {
                displayCyberSecurityNews(news.slice(0, 3), 'home-news-container');
            }
        });
    }
});
