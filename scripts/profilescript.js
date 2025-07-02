const ANIMATION_DURATION = 2000;
const FPS = 60;
const DEFAULT_THEME = 'light';

const userData = {
    name: 'John Doe',
    email: 'user@example.com',
    activePlan: 'Standard Mode',
    totalCampaigns: 156,
    totalRecipients: 45678,
    remainingCampaigns: 24,
    remainingRecipients: 400,
    subscriptionEnd: '2025-12-31',
    campaigns: [
        { 
            name: 'Loops by Zipulya', 
            date: '2023-06-15', 
            recipients: 5000, 
            attachments: ['loop1.mp3', 'loop2.mp3']
        }
    ]
};

class ProfileManager {
    constructor() {
        this.bindElements();
        this.attachEventListeners();
        this.updateProfileStats();
    }

    bindElements() {
        // Profile section elements
        this.profileSection = document.getElementById('profile');
        this.userEmail = document.getElementById('user-email');
        this.activePlan = document.getElementById('active-plan');
        this.upgradeBtn = document.getElementById('upgrade-btn');
        this.totalCampaigns = document.getElementById('total-campaigns');
        this.totalRecipients = document.getElementById('total-recipients');
        this.remainingCampaigns = document.getElementById('remaining-campaigns');
        this.remainingRecipients = document.getElementById('remaining-recipients');
        this.subscriptionEnd = document.getElementById('subscription-end');

        // Campaign section elements
        this.campaignSection = document.getElementById('campaign-management');
        this.campaignList = document.getElementById('campaign-list');
        this.campaignSearch = document.getElementById('campaign-search');
        this.campaignDateSearch = document.getElementById('campaign-date-search');
        this.attachmentSearch = document.getElementById('attachment-search');
        this.searchBtn = document.getElementById('search-btn');
    }

    updateProfileStats() {

        document.getElementById('user-name').textContent = userData.name;

        this.userEmail.textContent = userData.email;
        this.activePlan.textContent = userData.activePlan;
        this.totalCampaigns.textContent = userData.totalCampaigns;
        this.totalRecipients.textContent = userData.totalRecipients.toLocaleString();
        this.remainingCampaigns.textContent = userData.remainingCampaigns;
        this.remainingRecipients.textContent = userData.remainingRecipients.toLocaleString();
        this.subscriptionEnd.textContent = userData.subscriptionEnd;
    }

    attachEventListeners() {
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        document.getElementById('email-file').addEventListener('change', this.handleFileUpload);
        this.upgradeBtn.addEventListener('click', this.handleUpgrade);
    }

    showProfile() {
        document.querySelectorAll('section').forEach(section => section.style.display = 'none');
        this.profileSection.style.display = 'block';
        this.campaignSection.style.display = 'block';

        this.userEmail.textContent = userData.email;
        this.activePlan.textContent = userData.activePlan;

        this.renderCampaigns(userData.campaigns);
        this.animateCounters();
    }

    renderCampaigns(campaigns) {
        if (!campaigns.length) {
            this.campaignList.innerHTML = '<li>No campaigns match your search criteria.</li>';
            return;
        }

        this.campaignList.innerHTML = campaigns.map(campaign => `
            <li class="campaign-item">
                <div class="campaign-header">
                    <strong>${this.escapeHtml(campaign.name)}</strong>
                    <span class="campaign-date">${this.escapeHtml(campaign.date)}</span>
                </div>
                <div class="campaign-details">
                    <p>Recipients: ${campaign.recipients}</p>
                    ${this.renderAttachments(campaign.attachments)}
                </div>
            </li>
        `).join('');
    }

    renderAttachments(attachments) {
        if (!attachments.length) return '<p>Attachments: None</p>';
        return `
            <div class="campaign-attachments">
                <p>Attachments:</p>
                <ul>
                    ${attachments.map(att => `<li>${this.escapeHtml(att)}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    handleSearch() {
        const searchTerm = this.campaignSearch.value.toLowerCase();
        const dateSearch = this.campaignDateSearch.value;
        const attachmentSearchTerm = this.attachmentSearch.value.toLowerCase();

        const filteredCampaigns = userData.campaigns.filter(campaign => {
            const nameMatch = campaign.name.toLowerCase().includes(searchTerm);
            const dateMatch = !dateSearch || campaign.date === dateSearch;
            const attachmentMatch = !attachmentSearchTerm || 
                campaign.attachments.some(att => att.toLowerCase().includes(attachmentSearchTerm));
            return nameMatch && dateMatch && attachmentMatch;
        });

        this.renderCampaigns(filteredCampaigns);
    }

    animateCounters() {
        document.querySelectorAll('.counter').forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / (ANIMATION_DURATION / (1000 / FPS));
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.round(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });
    }

    handleUpgrade() {
        // Implement upgrade logic or redirect to payment page
        alert('Redirecting to upgrade options...');
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const validationResult = document.getElementById('validation-result');
        validationResult.innerHTML = 'Validating emails...';

        setTimeout(() => {
            const validCount = Math.floor(Math.random() * 1000);
            const invalidCount = Math.floor(Math.random() * 100);
            this.showValidationResults(validCount, invalidCount);
        }, 2000);
    }

    showValidationResults(validCount, invalidCount) {
        const validationResult = document.getElementById('validation-result');
        validationResult.innerHTML = `
            Validation complete: ${validCount} valid emails, ${invalidCount} invalid emails<br>
            <a href="#" id="download-report" class="btn btn-success">Download Validation Report</a>
        `;

        document.getElementById('download-report').addEventListener('click', (e) => {
            e.preventDefault();
            this.generateValidationReport(validCount, invalidCount);
        });
    }

    generateValidationReport(validCount, invalidCount) {
        const reportContent = `Email Validation Report
        Valid Emails: ${validCount}
        Invalid Emails: ${invalidCount}
        Date: ${new Date().toLocaleString()}`;

        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'validation_report.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

class ThemeManager {
    constructor() {
        this.init();
    }

    init() {
        const savedTheme = localStorage.getItem('theme') || DEFAULT_THEME;
        this.setTheme(savedTheme);
        this.bindThemeToggle();
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const themeIcon = document.getElementById('theme-icon');
        themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    bindThemeToggle() {
        const themeToggleBtn = document.querySelector('.theme-toggle-button');
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const profileManager = new ProfileManager();
    const themeManager = new ThemeManager();
    
    profileManager.showProfile();
});