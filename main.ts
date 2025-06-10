interface Window {
    Telegram: any;
    app: any;
}
declare var window: Window;

interface Campaign {
    id: number;
    name: string;
    status: 'active' | 'paused';
    stats: {
        impressions: number;
        clicks: number;
        cpc: number;
    };
}

interface Creative {
    id: number;
    name: string;
    preview: string;
    stats: {
        impressions: number;
    };
}

class App {
    private tg: any;
    private campaignsList: HTMLElement;
    private creativesList: HTMLElement;
    private autopilotToggle: HTMLInputElement;
    private uploadBtn: HTMLButtonElement;
    private fileInput: HTMLInputElement;

    constructor() {
        this.tg = window.Telegram.WebApp;
        this.campaignsList = document.getElementById('campaigns-list')!;
        this.creativesList = document.getElementById('creatives-list')!;
        this.autopilotToggle = document.getElementById('autopilot-toggle') as HTMLInputElement;
        this.uploadBtn = document.getElementById('upload-btn') as HTMLButtonElement;
        this.fileInput = document.getElementById('creative-upload') as HTMLInputElement;

        this.init();
    }

    private async init() {
        this.tg.expand();
        this.setupEventListeners();
        await this.loadCampaigns();
        await this.loadCreatives();
        await this.loadAutopilotStatus();
    }

    private setupEventListeners() {
        this.uploadBtn.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        this.autopilotToggle.addEventListener('change', (e) => this.handleAutopilotToggle(e));
    }

    private async loadCampaigns() {
        try {
            const response = await fetch('/api/campaigns');
            const campaigns: Campaign[] = await response.json();
            this.renderCampaigns(campaigns);
        } catch (error) {
            console.error('Error loading campaigns:', error);
        }
    }

    private async loadCreatives() {
        try {
            const response = await fetch('/api/creatives');
            const creatives: Creative[] = await response.json();
            this.renderCreatives(creatives);
        } catch (error) {
            console.error('Error loading creatives:', error);
        }
    }

    private async loadAutopilotStatus() {
        try {
            const response = await fetch('/api/autopilot');
            const { enabled } = await response.json();
            this.autopilotToggle.checked = enabled;
        } catch (error) {
            console.error('Error loading autopilot status:', error);
        }
    }

    private renderCampaigns(campaigns: Campaign[]) {
        this.campaignsList.innerHTML = campaigns.map(campaign => `
            <div class="campaign-card slide-in">
                <h3>${campaign.name}</h3>
                <p>Статус: ${campaign.status === 'active' ? 'Активна' : 'На паузе'}</p>
                <p>Показы: ${campaign.stats.impressions}</p>
                <p>Клики: ${campaign.stats.clicks}</p>
                <p>CPC: ${campaign.stats.cpc}</p>
                <button class="primary-btn" onclick="app.toggleCampaignStatus(${campaign.id})">
                    ${campaign.status === 'active' ? 'Поставить на паузу' : 'Активировать'}
                </button>
            </div>
        `).join('');
    }

    private renderCreatives(creatives: Creative[]) {
        this.creativesList.innerHTML = creatives.map(creative => `
            <div class="creative-item fade-in">
                <img src="${creative.preview}" alt="${creative.name}" style="width: 100px; height: 100px; object-fit: cover;">
                <div style="margin-left: 15px;">
                    <h4>${creative.name}</h4>
                    <p>Показы: ${creative.stats.impressions}</p>
                </div>
            </div>
        `).join('');
    }

    private async handleFileUpload(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files?.length) return;

        const file = input.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/creatives/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                await this.loadCreatives();
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }

    private async handleAutopilotToggle(event: Event) {
        const input = event.target as HTMLInputElement;
        try {
            const response = await fetch('/api/autopilot', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ enabled: input.checked })
            });

            if (!response.ok) {
                input.checked = !input.checked;
            }
        } catch (error) {
            console.error('Error toggling autopilot:', error);
            input.checked = !input.checked;
        }
    }

    public async toggleCampaignStatus(campaignId: number) {
        try {
            const response = await fetch(`/api/campaigns/${campaignId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'active' })
            });

            if (response.ok) {
                await this.loadCampaigns();
            }
        } catch (error) {
            console.error('Error toggling campaign status:', error);
        }
    }
}

window.app = new App(); 