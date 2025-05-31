// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Handle navigation link clicks
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    const sections = document.querySelectorAll('.content-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            
            // Remove active class from all nav links and sections
            navLinks.forEach(nl => nl.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked nav link and corresponding section
            this.classList.add('active');
            document.getElementById(targetSection).classList.add('active');
            
            // Smooth scroll to top of page
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
});

// Voice Assistant for Navigation
class VoiceAssistant {
    constructor() {
        this.speechSynthesis = window.speechSynthesis;
        this.currentSpeech = null;
        this.isEnabled = true;
        this.speechRate = 0.8;
        this.speechVolume = 0.9;
        this.currentStep = 0;
        
        this.procedures = {
            welcome: "Welcome to the Multi-Effect Evaporator Virtual Laboratory. I'm your voice assistant and I'll guide you through the simulation step by step. Click the assistant button to get started or ask for help at any time.",
            
            steps: [
                "Step 1: Let's begin by understanding the equipment setup. You can see three evaporator units connected in series. Each operates at progressively lower temperature and pressure.",
                
                "Step 2: Now, let's adjust the operating parameters. Use the steam temperature slider on the right panel. Set it between 140 to 180 degrees Celsius for optimal performance.",
                
                "Step 3: Next, set your feed rate using the second slider. This controls how much material flows through the system per hour. Try values between 300 to 700 kilograms per hour.",
                
                "Step 4: Configure the feed concentration - this is your starting material concentration. Adjust it according to your raw material, typically between 8 to 15 percent.",
                
                "Step 5: Set your target product concentration - this is your desired final result. Values between 40 to 55 percent are typical for most applications.",
                
                "Step 6: Adjust the cooling water flow to ensure proper condensation. Maintain adequate flow between 800 to 1500 liters per hour for optimal efficiency.",
                
                "Step 7: Now you're ready to start the experiment. Click the 'Start Experiment' button to begin the simulation and observe the real-time animations.",
                
                "Step 8: Watch the vapor animations and heating effects as the system operates. Monitor the key performance indicators that update in real-time.",
                
                "Step 9: Review the results including steam economy, heat transfer rate, final concentration, and total evaporation. These show your system's performance.",
                
                "Step 10: Use the toggle buttons to explore detailed calculations, formulas, and performance analysis for deeper understanding.",
                
                "Simulation complete! You can now experiment with different parameters or reset the system to try new configurations. Great job!"
            ],
            
            help: {
                steamTemp: "Steam temperature controls the driving force for evaporation. Higher temperatures increase efficiency but consume more energy. The optimal range is 140 to 180 degrees Celsius.",
                
                feedRate: "Feed rate determines your system throughput. Higher rates increase production but may reduce concentration efficiency. Balance is key for optimal operation.",
                
                concentration: "Feed concentration is your starting material's solids content. This affects how much water needs to be removed to reach your target.",
                
                targetConc: "Target concentration is your desired final product. Higher targets require more energy and time but yield more concentrated products.",
                
                coolingWater: "Cooling water flow affects condensation efficiency. Insufficient flow reduces system performance and vacuum maintenance.",
                
                results: "Key performance indicators show your system efficiency. Steam economy above 2.5 indicates good performance. Thermal efficiency above 80 percent is optimal.",
                
                experiment: "The experiment runs for 5 seconds to simulate steady-state operation. Watch the animations to see vapor flow and heating effects in real-time."
            },
            
            navigation: {
                experiment: "You're now in the experiment section where you can interact with the virtual evaporator. Use the control panel to adjust parameters and run simulations.",
                
                results: "This is the results section where you can review your experimental outcomes and analyze the performance data from your simulation."
            }
        };
        
        this.init();
    }
    
    init() {
        this.createVoiceAssistant();
        this.loadVoices();
    }
    
    createVoiceAssistant() {
        // Create floating voice assistant button
        const assistantButton = document.createElement('div');
        assistantButton.id = 'voiceAssistant';
        assistantButton.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 70px;
            height: 70px;
            background: linear-gradient(135deg, #2c3e50, #34495e);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 10px 30px rgba(44, 62, 80, 0.3);
            z-index: 1000;
            transition: all 0.3s ease;
            border: 3px solid #3498db;
        `;
        
        assistantButton.innerHTML = `
            <i class="fas fa-user-tie" style="color: #3498db; font-size: 1.6em;"></i>
        `;
        
        // Add hover effects
        assistantButton.addEventListener('mouseenter', () => {
            assistantButton.style.transform = 'scale(1.1)';
            assistantButton.style.boxShadow = '0 15px 40px rgba(52, 152, 219, 0.4)';
        });
        
        assistantButton.addEventListener('mouseleave', () => {
            assistantButton.style.transform = 'scale(1)';
            assistantButton.style.boxShadow = '0 10px 30px rgba(44, 62, 80, 0.3)';
        });
        
        assistantButton.addEventListener('click', () => {
            this.toggleAssistantPanel();
        });
        
        document.body.appendChild(assistantButton);
        
        // Create assistant panel
        this.createAssistantPanel();
        
        // Auto-welcome after page load
        setTimeout(() => {
            this.speak(this.procedures.welcome);
        }, 2000);
    }
    
    createAssistantPanel() {
        const panel = document.createElement('div');
        panel.id = 'assistantPanel';
        panel.style.cssText = `
            position: fixed;
            bottom: 45px;
            right: 120px;
            background: linear-gradient(135deg, #2c3e50, #34495e);
            color: white;
            padding: 12px;
            border-radius: 10px;
            box-shadow: 0 15px 50px rgba(0,0,0,0.3);
            z-index: 999;
            width: 400px;
            height: auto;
            max-height: 120px;
            transform: translateX(20px) scale(0.95);
            opacity: 0;
            visibility: hidden;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 2px solid #3498db;
            backdrop-filter: blur(10px);
        `;
        
        panel.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 6px;">
                    <i class="fas fa-user-tie" style="color: #3498db; font-size: 1em;"></i>
                    <h3 style="margin: 0; font-size: 0.8em; font-weight: 600;">Voice Assistant</h3>
                </div>
                <div style="display: flex; align-items: center; gap: 4px;">
                    <i id="assistantStatusIcon" class="fas fa-microphone" style="color: #3498db; font-size: 0.7em;"></i>
                    <span id="assistantStatusText" style="font-weight: 600; font-size: 0.7em;">Ready</span>
                    <button id="closeAssistant" style="background: none; border: none; color: white; font-size: 0.9em; cursor: pointer; padding: 2px; border-radius: 3px; transition: background 0.3s; margin-left: 8px;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            
            <div style="display: flex; align-items: center; gap: 10px;">
                <!-- Main Controls -->
                <div style="display: flex; gap: 6px; flex: 1;">
                    <button id="startGuide" class="assistant-btn" style="background: #27ae60; flex: 1;">
                        <i class="fas fa-play"></i> Start
                    </button>
                    <button id="nextStep" class="assistant-btn" style="background: #3498db; flex: 1;">
                        <i class="fas fa-step-forward"></i> Next
                    </button>
                    <button id="repeatStep" class="assistant-btn" style="background: #f39c12; flex: 0.8;">
                        <i class="fas fa-redo"></i>
                    </button>
                    <button id="stopSpeech" class="assistant-btn" style="background: #e74c3c; flex: 0.8;">
                        <i class="fas fa-stop"></i>
                    </button>
                </div>
                
                <!-- Settings -->
                <div style="display: flex; align-items: center; gap: 8px; font-size: 0.65em; border-left: 1px solid rgba(255,255,255,0.2); padding-left: 10px;">
                    <label style="display: flex; align-items: center; gap: 3px;">
                        <input type="checkbox" id="autoSpeak" checked style="transform: scale(0.7);">
                        <span style="color: #bdc3c7;">Auto</span>
                    </label>
                    <div style="display: flex; align-items: center; gap: 3px;">
                        <span style="color: #bdc3c7;">Speed:</span>
                        <input type="range" id="speechSpeed" min="0.5" max="1.5" step="0.1" value="0.8" style="width: 40px;">
                    </div>
                </div>
            </div>
            
            <div id="currentMessage" style="font-size: 0.6em; line-height: 1.1; color: #bdc3c7; margin-top: 6px; max-height: 20px; overflow: hidden; text-align: center;">
                Auto-guidance active • Click Start to begin step-by-step procedure
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // Add styles for buttons
        const assistantStyles = document.createElement('style');
        assistantStyles.textContent = `
            .assistant-btn {
                color: white;
                border: none;
                padding: 5px 6px;
                border-radius: 4px;
                font-size: 0.65em;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 3px;
                font-weight: 600;
                min-height: 28px;
            }
            .assistant-btn:hover {
                transform: translateY(-1px);
                filter: brightness(1.1);
            }
            #assistantPanel input[type="range"] {
                -webkit-appearance: none;
                height: 2px;
                background: rgba(255,255,255,0.3);
                border-radius: 1px;
                outline: none;
            }
            #assistantPanel input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 8px;
                height: 8px;
                background: #3498db;
                border-radius: 50%;
                cursor: pointer;
            }
            #closeAssistant:hover {
                background: rgba(255,255,255,0.1);
            }
        `;
        document.head.appendChild(assistantStyles);
        
        this.setupAssistantListeners();
    }
    
    setupAssistantListeners() {
        // Close button
        document.getElementById('closeAssistant').addEventListener('click', () => {
            this.hideAssistantPanel();
        });
        
        // Main control buttons
        document.getElementById('startGuide').addEventListener('click', () => {
            this.currentStep = 0;
            this.speakStep(1);
        });
        
        document.getElementById('nextStep').addEventListener('click', () => {
            this.nextStep();
        });
        
        document.getElementById('repeatStep').addEventListener('click', () => {
            this.speakStep(this.currentStep + 1);
        });
        
        document.getElementById('stopSpeech').addEventListener('click', () => {
            this.stopSpeech();
        });
        
        // Settings
        document.getElementById('speechSpeed').addEventListener('input', (e) => {
            this.speechRate = parseFloat(e.target.value);
        });
    }
    
    toggleAssistantPanel() {
        const panel = document.getElementById('assistantPanel');
        const isVisible = panel.style.visibility === 'visible';
        
        if (isVisible) {
            this.hideAssistantPanel();
        } else {
            this.showAssistantPanel();
        }
    }
    
    showAssistantPanel() {
        const panel = document.getElementById('assistantPanel');
        panel.style.visibility = 'visible';
        panel.style.opacity = '1';
        panel.style.transform = 'translateX(0) scale(1)';
    }
    
    hideAssistantPanel() {
        const panel = document.getElementById('assistantPanel');
        panel.style.opacity = '0';
        panel.style.transform = 'translateX(20px) scale(0.95)';
        panel.style.visibility = 'hidden';
    }
    
    loadVoices() {
        // Wait for voices to load
        if (this.speechSynthesis.getVoices().length === 0) {
            this.speechSynthesis.addEventListener('voiceschanged', () => {
                this.loadVoices();
            });
            return;
        }
    }
    
    getMaleVoice() {
        const voices = this.speechSynthesis.getVoices();
        
        // Look for male voices by name patterns
        const maleVoice = voices.find(voice => 
            voice.name.includes('Google UK English Male') ||
            voice.name.includes('Microsoft David') ||
            voice.name.includes('Microsoft Mark') ||
            voice.name.includes('Alex') ||
            voice.name.includes('Daniel') ||
            voice.name.includes('Thomas') ||
            voice.name.includes('Male') ||
            voice.name.includes('David') ||
            voice.name.includes('Mark') ||
            voice.name.toLowerCase().includes('male')
        );
        
        // Fallback to any English voice
        if (!maleVoice) {
            return voices.find(voice => voice.lang.includes('en')) || voices[0];
        }
        
        return maleVoice;
    }
    
    speak(text) {
        if (!this.isEnabled) return;
        
        this.stopSpeech();
        
        this.updateStatus('Speaking...', text);
        
        this.currentSpeech = new SpeechSynthesisUtterance(text);
        this.currentSpeech.rate = this.speechRate;
        this.currentSpeech.pitch = 0.9; // Slightly lower pitch for male voice
        this.currentSpeech.volume = this.speechVolume;
        
        const maleVoice = this.getMaleVoice();
        if (maleVoice) {
            this.currentSpeech.voice = maleVoice;
        }
        
        this.currentSpeech.onstart = () => {
            this.updateStatus('Speaking...', text);
        };
        
        this.currentSpeech.onend = () => {
            this.updateStatus('Ready to help', 'Guidance completed');
        };
        
        this.currentSpeech.onerror = () => {
            this.updateStatus('Error', 'Speech error occurred');
        };
        
        this.speechSynthesis.speak(this.currentSpeech);
    }
    
    stopSpeech() {
        if (this.speechSynthesis) {
            this.speechSynthesis.cancel();
        }
        this.updateStatus('Ready to help', 'Speech stopped');
    }
    
    speakStep(stepIndex) {
        if (stepIndex >= 1 && stepIndex <= this.procedures.steps.length) {
            this.currentStep = stepIndex - 1; // Convert to 0-indexed
            this.speak(this.procedures.steps[stepIndex - 1]);
            
            // Update assistant panel to show current step
            this.updateStatus('Speaking...', `Step ${stepIndex} guidance`);
        }
    }
    
    nextStep() {
        if (this.currentStep < this.procedures.steps.length - 1) {
            this.currentStep++;
            this.speakStep(this.currentStep + 1); // Convert to 1-indexed
        } else {
            this.speak("You've completed all the guided steps! Feel free to experiment or ask for specific help.");
        }
    }
    
    updateStatus(status, message) {
        const statusText = document.getElementById('assistantStatusText');
        const statusIcon = document.getElementById('assistantStatusIcon');
        const messageEl = document.getElementById('currentMessage');
        
        if (statusText) statusText.textContent = status;
        if (messageEl && message) messageEl.textContent = message;
        
        if (statusIcon) {
            if (status === 'Speaking...') {
                statusIcon.className = 'fas fa-volume-up';
                statusIcon.style.color = '#27ae60';
            } else {
                statusIcon.className = 'fas fa-microphone';
                statusIcon.style.color = '#3498db';
            }
        }
    }
    
    // Method to sync with lab progress
    syncWithLabProgress(labProgress) {
        this.currentStep = labProgress.currentStep;
    }
}

// Virtual Lab: Multi-Effect Evaporator
class MultiEffectEvaporatorLab {
    constructor(voiceAssistant = null) {
        this.isRunning = false;
        this.animationId = null;
        this.voiceAssistant = voiceAssistant;
        this.userProgress = {
            hasAdjustedSteam: false,
            hasAdjustedFeed: false,
            hasAdjustedConcentration: false,
            hasAdjustedTarget: false,
            hasAdjustedCooling: false,
            hasStartedExperiment: false,
            hasViewedResults: false,
            currentStep: 0
        };
        this.parameters = {
            steamTemp: 150,
            feedRate: 500,
            concentration: 10,
            numEffects: 3,
            targetProductConc: 45,
            coolingWaterFlow: 1000
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTooltips();
        this.setupToggleFunctions();
        this.updateDisplayValues();
        this.calculateResults();
        
        // Start initial guidance after a delay
        setTimeout(() => {
            this.triggerNextStep();
        }, 3000);
    }

    setupEventListeners() {
        // Control sliders with voice guidance
        const steamTempSlider = document.getElementById('steamTemp');
        const feedRateSlider = document.getElementById('feedRate');
        const concentrationSlider = document.getElementById('feedConcentration');
        const targetProductConcSlider = document.getElementById('targetProductConc');
        const coolingWaterFlowSlider = document.getElementById('coolingWaterFlow');

        steamTempSlider.addEventListener('input', (e) => {
            this.parameters.steamTemp = parseInt(e.target.value);
            this.updateDisplayValues();
            this.calculateResults();
            
            if (!this.userProgress.hasAdjustedSteam) {
                this.userProgress.hasAdjustedSteam = true;
                this.triggerNextStep();
            }
        });

        feedRateSlider.addEventListener('input', (e) => {
            this.parameters.feedRate = parseInt(e.target.value);
            this.updateDisplayValues();
            this.calculateResults();
            
            if (!this.userProgress.hasAdjustedFeed && this.userProgress.hasAdjustedSteam) {
                this.userProgress.hasAdjustedFeed = true;
                this.triggerNextStep();
            }
        });

        concentrationSlider.addEventListener('input', (e) => {
            this.parameters.concentration = parseInt(e.target.value);
            this.updateDisplayValues();
            this.calculateResults();
            
            if (!this.userProgress.hasAdjustedConcentration && this.userProgress.hasAdjustedFeed) {
                this.userProgress.hasAdjustedConcentration = true;
                this.triggerNextStep();
            }
        });

        targetProductConcSlider.addEventListener('input', (e) => {
            this.parameters.targetProductConc = parseInt(e.target.value);
            this.updateDisplayValues();
            this.calculateResults();
            
            if (!this.userProgress.hasAdjustedTarget && this.userProgress.hasAdjustedConcentration) {
                this.userProgress.hasAdjustedTarget = true;
                this.triggerNextStep();
            }
        });

        coolingWaterFlowSlider.addEventListener('input', (e) => {
            this.parameters.coolingWaterFlow = parseInt(e.target.value);
            this.updateDisplayValues();
            this.calculateResults();
            
            if (!this.userProgress.hasAdjustedCooling && this.userProgress.hasAdjustedTarget) {
                this.userProgress.hasAdjustedCooling = true;
                this.triggerNextStep();
            }
        });

        // Control buttons with voice guidance
        document.getElementById('startExperiment').addEventListener('click', () => {
            this.startExperiment();
            
            if (!this.userProgress.hasStartedExperiment && this.userProgress.hasAdjustedCooling) {
                this.userProgress.hasStartedExperiment = true;
                this.triggerNextStep();
            }
        });

        document.getElementById('resetExperiment').addEventListener('click', () => {
            this.resetExperiment();
            this.resetProgress();
        });
        
        // Add navigation listeners for voice guidance
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                const section = link.getAttribute('data-section');
                if (section === 'results' && !this.userProgress.hasViewedResults && this.userProgress.hasStartedExperiment) {
                    this.userProgress.hasViewedResults = true;
                    setTimeout(() => this.triggerNextStep(), 500);
                }
            });
        });
    }

    triggerNextStep() {
        if (!this.voiceAssistant) return;
        
        const currentStep = this.userProgress.currentStep;
        
        // Define step progression based on user actions
        const stepProgression = [
            () => !this.userProgress.hasAdjustedSteam, // Step 1: Initial guidance
            () => this.userProgress.hasAdjustedSteam && !this.userProgress.hasAdjustedFeed, // Step 2: Steam adjusted
            () => this.userProgress.hasAdjustedFeed && !this.userProgress.hasAdjustedConcentration, // Step 3: Feed adjusted
            () => this.userProgress.hasAdjustedConcentration && !this.userProgress.hasAdjustedTarget, // Step 4: Concentration adjusted
            () => this.userProgress.hasAdjustedTarget && !this.userProgress.hasAdjustedCooling, // Step 5: Target adjusted
            () => this.userProgress.hasAdjustedCooling && !this.userProgress.hasStartedExperiment, // Step 6: Cooling adjusted
            () => this.userProgress.hasStartedExperiment && !this.userProgress.hasViewedResults, // Step 7: Experiment started
            () => this.userProgress.hasViewedResults // Step 8: Results viewed
        ];
        
        // Find the current appropriate step
        for (let i = 0; i < stepProgression.length; i++) {
            if (stepProgression[i]()) {
                if (i !== this.userProgress.currentStep) {
                    this.userProgress.currentStep = i;
                    this.voiceAssistant.speakStep(i + 1); // Steps are 1-indexed in voice assistant
                }
                break;
            }
        }
    }

    resetProgress() {
        this.userProgress = {
            hasAdjustedSteam: false,
            hasAdjustedFeed: false,
            hasAdjustedConcentration: false,
            hasAdjustedTarget: false,
            hasAdjustedCooling: false,
            hasStartedExperiment: false,
            hasViewedResults: false,
            currentStep: 0
        };
        
        // Restart guidance after reset
        setTimeout(() => {
            if (this.voiceAssistant) {
                this.voiceAssistant.speak("System has been reset. Let's start the procedure again from the beginning.");
                setTimeout(() => this.triggerNextStep(), 2000);
            }
        }, 1000);
    }

    setupTooltips() {
        const tooltip = document.getElementById('tooltip');
        const evaporatorUnits = document.querySelectorAll('.evaporator-unit');
        const labels = document.querySelectorAll('.label');

        // Tooltip data for different components
        const tooltipData = {
            'Effect 1': {
                title: 'First Effect Evaporator',
                description: 'Primary evaporation unit heated by high-pressure steam. Operating at the highest temperature and pressure in the system.',
                details: `• Temperature: ${this.getEffectTemperature(1)}°C\n• Pressure: High (3-4 bar)\n• Heat Source: Direct Steam\n• Function: Initial concentration`
            },
            'Effect 2': {
                title: 'Second Effect Evaporator',
                description: 'Secondary evaporation unit heated by vapor from the first effect. Operating at intermediate conditions.',
                details: `• Temperature: ${this.getEffectTemperature(2)}°C\n• Pressure: Medium (1-2 bar)\n• Heat Source: Effect 1 Vapor\n• Function: Further concentration`
            },
            'Effect 3': {
                title: 'Third Effect Evaporator',
                description: 'Final evaporation unit heated by vapor from the second effect. Operating at the lowest temperature and pressure.',
                details: `• Temperature: ${this.getEffectTemperature(3)}°C\n• Pressure: Low (0.5-1 bar)\n• Heat Source: Effect 2 Vapor\n• Function: Final concentration`
            }
        };

        // Add tooltips for evaporator units
        evaporatorUnits.forEach(unit => {
            const labelText = unit.getAttribute('data-label');
            
            unit.addEventListener('mouseenter', (e) => {
                const data = tooltipData[labelText];
                if (data) {
                    tooltip.innerHTML = `
                        <strong>${data.title}</strong><br>
                        ${data.description}<br><br>
                        <small>${data.details.replace(/\n/g, '<br>')}</small>
                    `;
                    tooltip.classList.add('visible');
                }
            });

            unit.addEventListener('mousemove', (e) => {
                const container = e.currentTarget.closest('.evaporator-setup');
                const rect = container.getBoundingClientRect();
                const tooltipRect = tooltip.getBoundingClientRect();
                let left = e.clientX - rect.left + 15;
                let top = e.clientY - rect.top - 15;
                // Clamp left and top so tooltip stays in container
                left = Math.max(0, Math.min(left, rect.width - tooltipRect.width));
                top = Math.max(0, Math.min(top, rect.height - tooltipRect.height));
                tooltip.style.left = left + 'px';
                tooltip.style.top = top + 'px';
            });

            unit.addEventListener('mouseleave', () => {
                tooltip.classList.remove('visible');
            });
        });

        // Add tooltips for stream labels
        const streamTooltips = {
            'steam-label': 'High pressure steam input (150-200°C) - Primary heating medium for the first effect',
            'condensate-label': 'Concrete: This represents the condensed output stream in this simulation.',
            'feed-label': 'Raw material feed stream - Initial dilute solution to be concentrated',
            'product-label': 'Concentrated product stream - Final output with desired concentration',
            'condenser-label': 'Condenser: Cools and condenses vapor into liquid (distillate/product). Located at the vapor outlet.'
        };

        labels.forEach(label => {
            const classList = Array.from(label.classList);
            let tooltipKey = classList.find(cls => streamTooltips[cls]);
            // Special case for condenser label (by text)
            if (!tooltipKey && label.textContent.trim().toLowerCase() === 'condenser') {
                tooltipKey = 'condenser-label';
            }
            if (tooltipKey) {
                label.style.cursor = 'pointer';
                
                label.addEventListener('mouseenter', (e) => {
                    tooltip.innerHTML = streamTooltips[tooltipKey];
                    tooltip.classList.add('visible');
                });

                label.addEventListener('mousemove', (e) => {
                    const container = e.currentTarget.closest('.evaporator-setup');
                    const rect = container.getBoundingClientRect();
                    const tooltipRect = tooltip.getBoundingClientRect();
                    let left = e.clientX - rect.left + 15;
                    let top = e.clientY - rect.top - 15;
                    // Clamp left and top so tooltip stays in container
                    left = Math.max(0, Math.min(left, rect.width - tooltipRect.width));
                    top = Math.max(0, Math.min(top, rect.height - tooltipRect.height));
                    tooltip.style.left = left + 'px';
                    tooltip.style.top = top + 'px';
                });

                label.addEventListener('mouseleave', () => {
                    tooltip.classList.remove('visible');
                });
            }
        });
    }

    setupToggleFunctions() {
        // Helper function to toggle sections with better feedback
        const toggleSection = (buttonId, contentId, buttonText) => {
            const button = document.getElementById(buttonId);
            const content = document.getElementById(contentId);
            
            if (button && content) {
                // Set initial state
                content.style.display = 'none';
                
                button.addEventListener('click', () => {
                    const isHidden = content.style.display === 'none';
                    content.style.display = isHidden ? 'block' : 'none';
                    
                    // Update button text to reflect state
                    const action = isHidden ? 'Hide' : 'Show';
                    const spanElement = button.querySelector('span');
                    
                    if (spanElement) {
                        spanElement.textContent = `${action} ${buttonText}`;
                    }
                    
                    // Add smooth transition
                    if (isHidden) {
                        content.style.opacity = '0';
                        content.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            content.style.opacity = '1';
                            content.style.transform = 'translateY(0)';
                        }, 50);
                    }
                });
                
                console.log(`Toggle function set up for ${buttonId}`);
            } else {
                console.error(`Could not find button (${buttonId}) or content (${contentId})`);
            }
        };

        // Set up all toggle functions
        toggleSection('toggleGuide', 'guideContent', 'Procedure');
        toggleSection('toggleCalculations', 'calculationsContent', 'Detailed Calculations');
        toggleSection('toggleFormulas', 'formulasContent', 'Formulas & Theory');
        toggleSection('toggleAnalysis', 'analysisContent', 'Performance Analysis');
    }

    updateDisplayValues() {
        document.getElementById('steamTempValue').textContent = `${this.parameters.steamTemp}°C`;
        document.getElementById('feedRateValue').textContent = `${this.parameters.feedRate} kg/hr`;
        document.getElementById('concentrationValue').textContent = `${this.parameters.concentration}%`;
        document.getElementById('targetProductConcValue').textContent = `${this.parameters.targetProductConc}%`;
        document.getElementById('coolingWaterFlowValue').textContent = `${this.parameters.coolingWaterFlow} L/hr`;

        // Update temperature displays in the diagram
        document.getElementById('temp1').textContent = `${this.getEffectTemperature(1)}°C`;
        document.getElementById('temp2').textContent = `${this.getEffectTemperature(2)}°C`;
        document.getElementById('temp3').textContent = `${this.getEffectTemperature(3)}°C`;
        
        // Update summary parameters
        this.updateSummaryValues();
    }

    updateSummaryValues() {
        // Update experimental parameters in summary
        const summaryStealthTemp = document.getElementById('summaryStealthTemp');
        const summaryFeedRate = document.getElementById('summaryFeedRate');
        const summaryFeedConc = document.getElementById('summaryFeedConc');
        const summaryTargetConc = document.getElementById('summaryTargetConc');
        const summaryCoolingFlow = document.getElementById('summaryCoolingFlow');
        
        if (summaryStealthTemp) summaryStealthTemp.textContent = `${this.parameters.steamTemp}°C`;
        if (summaryFeedRate) summaryFeedRate.textContent = `${this.parameters.feedRate} kg/hr`;
        if (summaryFeedConc) summaryFeedConc.textContent = `${this.parameters.concentration}%`;
        if (summaryTargetConc) summaryTargetConc.textContent = `${this.parameters.targetProductConc}%`;
        if (summaryCoolingFlow) summaryCoolingFlow.textContent = `${this.parameters.coolingWaterFlow} L/hr`;
        
        // Update key results in summary
        const summarySteamEconomy = document.getElementById('summarySteamEconomy');
        const summaryHeatTransfer = document.getElementById('summaryHeatTransfer');
        const summaryFinalConc = document.getElementById('summaryFinalConc');
        const summaryTotalEvap = document.getElementById('summaryTotalEvap');
        const summaryThermalEff = document.getElementById('summaryThermalEff');
        
        if (summarySteamEconomy) {
            const steamEconomyValue = document.getElementById('steamEconomy').textContent;
            summarySteamEconomy.textContent = `${steamEconomyValue} kg/kg`;
        }
        if (summaryHeatTransfer) {
            const heatTransferValue = document.getElementById('heatTransfer').textContent;
            summaryHeatTransfer.textContent = `${heatTransferValue} kW`;
        }
        if (summaryFinalConc) {
            const finalConcValue = document.getElementById('finalConcentration').textContent;
            summaryFinalConc.textContent = `${finalConcValue}%`;
        }
        if (summaryTotalEvap) {
            const totalEvapValue = document.getElementById('totalEvaporation').textContent;
            summaryTotalEvap.textContent = `${totalEvapValue} kg/hr`;
        }
        if (summaryThermalEff) {
            const thermalEffValue = document.getElementById('thermalEfficiency').textContent;
            summaryThermalEff.textContent = `${thermalEffValue}%`;
        }
        
        // Update summary findings values
        const performanceSteamEconomy = document.getElementById('performanceSteamEconomy');
        const concentrationFrom = document.getElementById('concentrationFrom');
        const concentrationTo = document.getElementById('concentrationTo');
        const efficiencyValue = document.getElementById('efficiencyValue');
        
        if (performanceSteamEconomy) {
            const steamEconomyValue = document.getElementById('steamEconomy').textContent;
            performanceSteamEconomy.textContent = `${steamEconomyValue} kg/kg`;
        }
        if (concentrationFrom) concentrationFrom.textContent = `${this.parameters.concentration}%`;
        if (concentrationTo) {
            const finalConcValue = document.getElementById('finalConcentration').textContent;
            concentrationTo.textContent = `${finalConcValue}%`;
        }
        if (efficiencyValue) {
            const thermalEffValue = document.getElementById('thermalEfficiency').textContent;
            efficiencyValue.textContent = `${thermalEffValue}%`;
        }
    }

    getEffectTemperature(effectNumber) {
        // Calculate temperatures based on steam temperature with decreasing trend
        const baseTemp = this.parameters.steamTemp;
        const tempDrops = [0, 30, 50]; // Temperature drops for each effect
        return Math.max(baseTemp - tempDrops[effectNumber - 1], 60);
    }

    calculateResults() {
        // Simulate multi-effect evaporator calculations
        const steamTemp = this.parameters.steamTemp;
        const feedRate = this.parameters.feedRate;
        const initialConc = this.parameters.concentration;
        const numEffects = this.parameters.numEffects;
        const targetProductConc = this.parameters.targetProductConc;
        const coolingWaterFlow = this.parameters.coolingWaterFlow;

        // Calculate steam economy (improves with more effects)
        const temperatureRange = steamTemp - 60; // Assume final temp ~60°C
        let steamEconomy = 2.2 + (temperatureRange / 100) * 0.8;
        steamEconomy += (numEffects - 3) * 0.5; // +0.5 per extra effect
        if (numEffects === 2) steamEconomy -= 0.5;

        // Calculate heat transfer rate (simplified)
        const heatTransfer = (feedRate * 4.18 * (steamTemp - 25)) / 3600; // kW

        // Calculate water removal rate (slightly better with more effects)
        let waterRemovalRate = 0.70 + (steamTemp - 100) / 500 + (numEffects - 3) * 0.03;
        // Clamp to [0.65, 0.90]
        waterRemovalRate = Math.max(0.65, Math.min(waterRemovalRate, 0.90));

        // Calculate final concentration (use target if higher than calculated)
        let finalConcentration = initialConc / (1 - waterRemovalRate);
        if (targetProductConc > finalConcentration) finalConcentration = targetProductConc;

        // Calculate total evaporation
        const totalEvaporation = feedRate * waterRemovalRate;

        // Cooling water effect (for info, not used in main calcs)
        // Could show a warning if cooling water is too low for condensation
        if (coolingWaterFlow < totalEvaporation * 2) {
            document.getElementById('coolingWaterFlowValue').style.color = '#e74c3c';
        } else {
            document.getElementById('coolingWaterFlowValue').style.color = '';
        }

        // Calculate intermediate values for detailed calculations
        const steamConsumption = totalEvaporation / steamEconomy; // kg/hr
        const productFlow = feedRate - totalEvaporation; // kg/hr
        const thermalEfficiency = Math.min(95, 70 + (steamEconomy - 2) * 8); // %
        const specificEnergy = heatTransfer / productFlow; // kWh/kg (approx)
        const coolingWaterReq = (totalEvaporation * 2300) / (4.18 * 10); // L/hr (simplified)

        // Update results display
        document.getElementById('steamEconomy').textContent = steamEconomy.toFixed(2);
        document.getElementById('heatTransfer').textContent = `${Math.round(heatTransfer)}`;
        document.getElementById('finalConcentration').textContent = `${Math.round(finalConcentration)}`;
        document.getElementById('totalEvaporation').textContent = `${Math.round(totalEvaporation)}`;

        // Update intermediate calculations display
        document.getElementById('waterRemovalRate').textContent = waterRemovalRate.toFixed(3);
        document.getElementById('steamConsumption').textContent = Math.round(steamConsumption);
        document.getElementById('productFlow').textContent = Math.round(productFlow);
        document.getElementById('thermalEfficiency').textContent = Math.round(thermalEfficiency);
        document.getElementById('specificEnergy').textContent = specificEnergy.toFixed(1);
        document.getElementById('coolingWaterReq').textContent = Math.round(coolingWaterReq);
        
        // Update summary values
        this.updateSummaryValues();
    }

    startExperiment() {
        if (this.isRunning) return;

        this.isRunning = true;
        const diagram = document.querySelector('.evaporator-setup');
        diagram.classList.add('running');

        // Start vapor animation
        this.animateVapors();
        // Start water heating effect
        this.animateWaterHeating();

        // Update button states
        document.getElementById('startExperiment').textContent = 'Running...';
        document.getElementById('startExperiment').disabled = true;

        // Simulate experiment running for realistic duration
        setTimeout(() => {
            this.completeExperiment();
        }, 5000); // 5 seconds simulation

        // Add dynamic effects during experiment
        this.animateExperiment();
        
        // Show start notification
        this.showNotification('Experiment started! Monitoring system performance...', 'info');
    }

    animateVapors() {
        // Animate 6 small vapor blobs per vapor line
        const vaporLines = [
            { id: 'vapor1', path: [[245,77],[350,77],[350,140]] },
            { id: 'vapor2', path: [[505,77],[610,77],[610,140]] },
            { id: 'vapor3', path: [[765,77],[850,77]] }
        ];
        const numBlobs = 6;
        const blobs = [];
        for (let i = 0; i < vaporLines.length; ++i) {
            for (let j = 0; j < numBlobs; ++j) {
                blobs.push({
                    el: document.getElementById(`${vaporLines[i].id}_${j}`),
                    path: vaporLines[i].path,
                    idx: j
                });
            }
        }
        let start;
        const duration = 2200; // ms
        const animate = (timestamp) => {
            if (!this.isRunning) {
                blobs.forEach(b => b.el.setAttribute('opacity', 0));
                return;
            }
            if (!start) start = timestamp;
            const elapsed = (timestamp - start) % duration;
            blobs.forEach((b, k) => {
                // Staggered start for each blob
                const phase = (elapsed - (b.idx * duration / numBlobs) + duration) % duration;
                let t = phase / duration;
                if (t > 1) t = 1;
                // Path following logic
                let cx, cy;
                if (b.path.length === 3) {
                    // Two-segment path: horizontal then vertical
                    if (t < 0.5) {
                        // First segment: horizontal
                        let segT = t / 0.5;
                        cx = b.path[0][0] + (b.path[1][0] - b.path[0][0]) * segT;
                        cy = b.path[0][1];
                    } else {
                        // Second segment: vertical
                        let segT = (t - 0.5) / 0.5;
                        cx = b.path[1][0];
                        cy = b.path[1][1] + (b.path[2][1] - b.path[1][1]) * segT;
                    }
                } else {
                    // Single horizontal segment
                    cx = b.path[0][0] + (b.path[1][0] - b.path[0][0]) * t;
                    cy = b.path[0][1];
                }
                // Small random y offset for steaminess
                const yRand = (Math.sin((elapsed/400 + b.idx) * 2) + Math.random()*0.2) * 2;
                // Fade in/out at ends
                let opacity = (t < 0.1 || t > 0.95) ? 0 : 0.5 + 0.5 * Math.sin(Math.PI * t);
                b.el.setAttribute('cx', cx);
                b.el.setAttribute('cy', cy + yRand);
                b.el.setAttribute('opacity', opacity);
            });
            this._vaporAnimId = requestAnimationFrame(animate);
        };
        this._vaporAnimId = requestAnimationFrame(animate);
    }

    animateWaterHeating() {
        // Animate the water for a realistic heating effect
        const waterIds = ['water1', 'water2', 'water3'];
        let t0 = null;
        const animate = (timestamp) => {
            if (!this.isRunning) {
                waterIds.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.setAttribute('fill', 'url(#waterGradient)');
                        el.setAttribute('opacity', '0.85');
                    }
                });
                return;
            }
            if (!t0) t0 = timestamp;
            const t = (timestamp - t0) / 1000;
            
            // Create gentle heating effect with opacity and fill changes
            const baseOpacity = 0.85;
            const opacityVariation = 0.1;
            const pulse = baseOpacity + opacityVariation * Math.sin(t * Math.PI / 1.2);
            
            waterIds.forEach((id, index) => {
                const el = document.getElementById(id);
                if (el) {
                    // Slight delay for each effect to show heat transfer
                    const phaseShift = index * 0.3;
                    const adjustedPulse = baseOpacity + opacityVariation * Math.sin((t + phaseShift) * Math.PI / 1.2);
                    el.setAttribute('opacity', adjustedPulse);
                    
                    // Gradually transition to heated water gradient
                    if (t > 2) {
                        el.setAttribute('fill', 'url(#heatedWaterGradient)');
                    }
                }
            });
            
            this._waterAnimId = requestAnimationFrame(animate);
        };
        this._waterAnimId = requestAnimationFrame(animate);
    }

    animateExperiment() {
        if (!this.isRunning) return;

        // Add subtle variations to results during experiment
        const variations = {
            steamEconomy: 0.08,
            heatTransfer: 40,
            finalConcentration: 1.5,
            totalEvaporation: 15
        };

        const updateResults = () => {
            if (!this.isRunning) return;

            // Get baseline values
            this.calculateResults();
            
            // Add small random variations to simulate real-time fluctuations
            const currentSteamEconomy = parseFloat(document.getElementById('steamEconomy').textContent);
            const currentHeatTransfer = parseInt(document.getElementById('heatTransfer').textContent);
            const currentFinalConc = parseInt(document.getElementById('finalConcentration').textContent);
            const currentTotalEvap = parseInt(document.getElementById('totalEvaporation').textContent);

            document.getElementById('steamEconomy').textContent = 
                (currentSteamEconomy + (Math.random() - 0.5) * variations.steamEconomy).toFixed(2);
            document.getElementById('heatTransfer').textContent = 
                `${Math.round(currentHeatTransfer + (Math.random() - 0.5) * variations.heatTransfer)}`;
            document.getElementById('finalConcentration').textContent = 
                `${Math.round(currentFinalConc + (Math.random() - 0.5) * variations.finalConcentration)}`;
            document.getElementById('totalEvaporation').textContent = 
                `${Math.round(currentTotalEvap + (Math.random() - 0.5) * variations.totalEvaporation)}`;

            this.animationId = setTimeout(updateResults, 600);
        };

        updateResults();
    }

    completeExperiment() {
        this.isRunning = false;
        
        if (this.animationId) {
            clearTimeout(this.animationId);
            this.animationId = null;
        }
        // Stop vapor and water animations
        if (this._vaporAnimId) cancelAnimationFrame(this._vaporAnimId);
        if (this._waterAnimId) cancelAnimationFrame(this._waterAnimId);
        // Hide all vapor blobs
        for (let i = 1; i <= 3; ++i) for (let j = 0; j < 6; ++j) {
            const el = document.getElementById(`vapor${i}_${j}`);
            if (el) el.setAttribute('opacity', 0);
        }
        // Reset water opacity
        ['water1','water2','water3'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.setAttribute('opacity', 0.85);
        });

        const diagram = document.querySelector('.evaporator-setup');
        diagram.classList.remove('running');

        // Update button states
        document.getElementById('startExperiment').textContent = 'Start Experiment';
        document.getElementById('startExperiment').disabled = false;

        // Recalculate final results
        this.calculateResults();

        // Show completion message
        this.showNotification('Experiment completed successfully! Results are now stable.', 'success');
        
        // Trigger voice guidance for experiment completion
        if (this.voiceAssistant && this.userProgress.hasStartedExperiment) {
            setTimeout(() => {
                this.voiceAssistant.speak("Excellent! The experiment has completed successfully. You can now review the results including steam economy, heat transfer rate, and final concentration. Navigate to the Results section to see detailed analysis.");
            }, 2000);
        }
    }

    resetExperiment() {
        this.isRunning = false;
        
        if (this.animationId) {
            clearTimeout(this.animationId);
            this.animationId = null;
        }
        // Stop vapor and water animations
        if (this._vaporAnimId) cancelAnimationFrame(this._vaporAnimId);
        if (this._waterAnimId) cancelAnimationFrame(this._waterAnimId);
        // Hide all vapor blobs
        for (let i = 1; i <= 3; ++i) for (let j = 0; j < 6; ++j) {
            const el = document.getElementById(`vapor${i}_${j}`);
            if (el) el.setAttribute('opacity', 0);
        }
        // Reset water opacity
        ['water1','water2','water3'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.setAttribute('opacity', 0.85);
        });

        const diagram = document.querySelector('.evaporator-setup');
        diagram.classList.remove('running');

        // Reset parameters to default
        this.parameters = {
            steamTemp: 150,
            feedRate: 500,
            concentration: 10,
            numEffects: 3,
            targetProductConc: 45,
            coolingWaterFlow: 1000
        };

        // Reset sliders
        document.getElementById('steamTemp').value = 150;
        document.getElementById('feedRate').value = 500;
        document.getElementById('feedConcentration').value = 10;
        document.getElementById('targetProductConc').value = 45;
        document.getElementById('coolingWaterFlow').value = 1000;

        // Reset button states
        document.getElementById('startExperiment').textContent = 'Start Experiment';
        document.getElementById('startExperiment').disabled = false;

        // Update all displays
        this.updateDisplayValues();
        this.calculateResults();

        this.showNotification('System reset to default parameters', 'info');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 30px;
            right: 30px;
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            padding: 18px 25px;
            border-radius: 12px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.2);
            z-index: 10000;
            font-weight: 600;
            font-size: 14px;
            transform: translateX(400px);
            transition: transform 0.4s ease;
            max-width: 350px;
            backdrop-filter: blur(10px);
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        }, 4000);
    }
}

// Initialize the virtual lab when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const voiceAssistant = new VoiceAssistant();
    const lab = new MultiEffectEvaporatorLab(voiceAssistant);
    
    // Add welcome message
    setTimeout(() => {
        lab.showNotification('Welcome to the Multi-Effect Evaporator Virtual Lab! The voice assistant will guide you through each step automatically.', 'info');
    }, 1000);
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 's':
                e.preventDefault();
                const startBtn = document.getElementById('startExperiment');
                if (startBtn) startBtn.click();
                break;
            case 'r':
                e.preventDefault();
                const resetBtn = document.getElementById('resetExperiment');
                if (resetBtn) resetBtn.click();
                break;
        }
    }
}); 
