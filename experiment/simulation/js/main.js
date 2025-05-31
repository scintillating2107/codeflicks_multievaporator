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

// Virtual Lab: Multi-Effect Evaporator
class MultiEffectEvaporatorLab {
    constructor() {
        this.isRunning = false;
        this.animationId = null;
        this.speechSynthesis = window.speechSynthesis;
        this.currentSpeech = null;
        this.voiceEnabled = true;
        this.speechRate = 0.9;
        this.speechVolume = 0.8;
        this.autoShowDialogue = true;
        this.autoAnnounceChanges = true;
        this.lastSpokenText = "";
        this.parameters = {
            steamTemp: 150,
            feedRate: 500,
            concentration: 10,
            numEffects: 3,
            targetProductConc: 45,
            coolingWaterFlow: 1000
        };
        
        this.voiceInstructions = {
            welcome: "Welcome to the Multi-Effect Evaporator Virtual Laboratory. This interactive simulation will help you understand the principles of multi-effect evaporation. You can adjust parameters using the control panel and observe the effects in real-time.",
            
            theory: "In the theory section, you will learn about multi-effect evaporation principles. This process uses multiple evaporation stages in series, where each effect operates at progressively lower temperature and pressure to maximize energy efficiency.",
            
            experiment: "In the experiment section, you can interact with the virtual evaporator. Use the operating parameters panel on the right to adjust steam temperature, feed rate, and other variables. Click start experiment to begin the simulation and observe the heating effects and vapor flow animations.",
            
            procedure: "Follow these experimental steps: First, adjust the steam temperature between 100 and 200 degrees Celsius. Second, set your feed rate between 100 and 1000 kilograms per hour. Third, configure the feed concentration and target product concentration. Finally, click start experiment to run the simulation.",
            
            parameters: "The operating parameters control the evaporation process. Steam temperature affects the driving force for heat transfer. Feed rate determines the throughput. Feed concentration is your starting material concentration, and target product concentration is your desired final result.",
            
            results: "The results section shows key performance indicators including steam economy, heat transfer rate, final concentration, and total evaporation. Steam economy indicates how efficiently the system uses energy. Values above 2.5 indicate good performance.",
            
            formulas: "The formulas section contains the mathematical equations used in calculations. Steam economy is calculated as 2.2 plus temperature effects. Heat transfer rate uses the standard thermal equation. These formulas help you understand the underlying physics.",
            
            analysis: "Performance analysis helps you optimize the system. Monitor steam economy for energy efficiency, check if concentrations meet targets, and ensure thermal efficiency exceeds 80 percent for optimal operation.",
            
            // Detailed procedural steps
            procedureSteps: [
                "Step 1: Adjust the steam temperature. Higher temperatures provide more driving force but consume more energy. The recommended range is 140 to 180 degrees Celsius for optimal performance.",
                "Step 2: Set the feed rate according to your processing requirements. Higher feed rates increase production but may reduce concentration efficiency. Try values between 300 and 700 kilograms per hour.",
                "Step 3: Configure the initial feed concentration. This represents your raw material. Typical values range from 8 to 15 percent depending on your application.",
                "Step 4: Set your target product concentration. This is your desired final concentration. Values between 40 and 55 percent are typical for most applications.",
                "Step 5: Adjust cooling water flow to ensure adequate condensation. Insufficient cooling water will reduce system efficiency. Recommended range is 800 to 1500 liters per hour.",
                "Step 6: Click start experiment to begin the simulation. Observe the heating effects, vapor flows, and real-time calculations as the system operates."
            ],
            
            // Parameter-specific guidance
            steamTempGuidance: "Steam temperature controls the heat input to the first effect. Higher temperatures increase evaporation rate but consume more energy. The current setting affects the temperature cascade across all three effects.",
            
            feedRateGuidance: "Feed rate determines the liquid throughput of the system. Higher rates increase production capacity but may reduce the residence time and concentration efficiency.",
            
            concentrationGuidance: "Feed concentration is the initial solids content of your material. This value affects the total water that needs to be removed to reach your target concentration.",
            
            targetConcGuidance: "Target product concentration is your desired final solids content. Higher targets require more water removal and energy consumption.",
            
            coolingWaterGuidance: "Cooling water flow rate affects the condensation efficiency in the final condenser. Adequate flow is essential for proper vapor condensation and vacuum maintenance.",
            
            // Experiment status announcements
            experimentStart: "Experiment started. The system is now heating up. You can observe the heating effects in the evaporator tubes and vapor movement through the connecting lines. Monitor the key performance indicators for real-time results.",
            
            experimentRunning: "The experiment is currently running. Steam is flowing through the heating coils, water is evaporating in each effect, and vapor is being condensed. The system is operating at steady state conditions.",
            
            experimentComplete: "Experiment completed successfully. The system has reached equilibrium. Review the final results including steam economy, heat transfer rate, and concentration achievement. The performance indicators show the overall system efficiency.",
            
            experimentReset: "System has been reset to default parameters. All values have returned to their initial settings. You can now adjust parameters for a new experimental run.",
            
            // Result interpretation
            resultHigh: "Excellent performance achieved. The system is operating efficiently with good steam economy and thermal performance.",
            
            resultMedium: "Acceptable performance. The system is working within normal parameters but there may be room for optimization.",
            
            resultLow: "Performance below optimal range. Consider adjusting steam temperature or other parameters to improve efficiency."
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTooltips();
        this.setupToggleFunctions();
        this.setupVoiceControls();
        this.updateDisplayValues();
        this.calculateResults();
    }

    setupEventListeners() {
        // Control sliders
        const steamTempSlider = document.getElementById('steamTemp');
        const feedRateSlider = document.getElementById('feedRate');
        const concentrationSlider = document.getElementById('feedConcentration');
        const targetProductConcSlider = document.getElementById('targetProductConc');
        const coolingWaterFlowSlider = document.getElementById('coolingWaterFlow');

        steamTempSlider.addEventListener('input', (e) => {
            this.parameters.steamTemp = parseInt(e.target.value);
            this.updateDisplayValues();
            this.calculateResults();
            this.announceParameterChange('steamTemp', e.target.value);
        });

        feedRateSlider.addEventListener('input', (e) => {
            this.parameters.feedRate = parseInt(e.target.value);
            this.updateDisplayValues();
            this.calculateResults();
            this.announceParameterChange('feedRate', e.target.value);
        });

        concentrationSlider.addEventListener('input', (e) => {
            this.parameters.concentration = parseInt(e.target.value);
            this.updateDisplayValues();
            this.calculateResults();
            this.announceParameterChange('concentration', e.target.value);
        });

        targetProductConcSlider.addEventListener('input', (e) => {
            this.parameters.targetProductConc = parseInt(e.target.value);
            this.updateDisplayValues();
            this.calculateResults();
            this.announceParameterChange('targetConc', e.target.value);
        });

        coolingWaterFlowSlider.addEventListener('input', (e) => {
            this.parameters.coolingWaterFlow = parseInt(e.target.value);
            this.updateDisplayValues();
            this.calculateResults();
            this.announceParameterChange('coolingWater', e.target.value);
        });

        // Control buttons
        document.getElementById('startExperiment').addEventListener('click', () => {
            this.startExperiment();
        });

        document.getElementById('resetExperiment').addEventListener('click', () => {
            this.resetExperiment();
        });
        
        // Add voice guidance button to control panel
        this.addVoiceToControlPanel();
    }

    addVoiceToControlPanel() {
        const controlPanel = document.querySelector('.control-panel');
        if (controlPanel) {
            const panelHeader = controlPanel.querySelector('.panel-header');
            if (panelHeader) {
                const voiceBtn = document.createElement('button');
                voiceBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                voiceBtn.title = 'Voice Parameter Guide';
                voiceBtn.style.cssText = `
                    background: var(--warning-color);
                    color: white;
                    border: none;
                    padding: 8px 10px;
                    border-radius: 50%;
                    margin-left: 10px;
                    cursor: pointer;
                    font-size: 0.9em;
                    transition: all 0.3s ease;
                `;
                voiceBtn.addEventListener('click', () => {
                    this.speakParameterGuidance();
                });
                
                const h3 = panelHeader.querySelector('h3');
                if (h3) {
                    h3.appendChild(voiceBtn);
                }
            }
        }
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
                    const iconElement = button.querySelector('i');
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

    setupVoiceControls() {
        // Create voice toggle button instead of always-visible dialogue
        this.createVoiceToggleButton();
        
        // Add voice buttons to sections
        this.addVoiceButtonsToSections();
    }

    createVoiceToggleButton() {
        // Create floating voice toggle button
        const toggleButton = document.createElement('div');
        toggleButton.id = 'voiceToggleButton';
        toggleButton.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 30px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, var(--secondary-color), #2980b9);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: var(--shadow-heavy);
            z-index: 1000;
            transition: all 0.3s ease;
            border: 3px solid white;
        `;
        
        toggleButton.innerHTML = `
            <i class="fas fa-volume-up" style="color: white; font-size: 1.4em;"></i>
        `;
        
        // Add hover effect
        toggleButton.addEventListener('mouseenter', () => {
            toggleButton.style.transform = 'scale(1.1)';
            toggleButton.style.boxShadow = '0 8px 25px rgba(52, 152, 219, 0.4)';
        });
        
        toggleButton.addEventListener('mouseleave', () => {
            toggleButton.style.transform = 'scale(1)';
            toggleButton.style.boxShadow = 'var(--shadow-heavy)';
        });
        
        // Toggle voice guide on click
        toggleButton.addEventListener('click', () => {
            this.toggleVoiceGuide();
        });
        
        document.body.appendChild(toggleButton);
        
        // Create the voice guide panel (hidden by default)
        this.createVoiceGuidePanel();
    }

    createVoiceGuidePanel() {
        const voicePanel = document.createElement('div');
        voicePanel.id = 'voiceGuidePanel';
        voicePanel.style.cssText = `
            position: fixed;
            bottom: 110px;
            left: 30px;
            background: linear-gradient(135deg, #2c3e50, #34495e);
            color: white;
            padding: 10px;
            border-radius: 10px;
            box-shadow: var(--shadow-heavy);
            z-index: 999;
            width: 260px;
            transform: translateY(20px) scale(0.95);
            opacity: 0;
            visibility: hidden;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 2px solid var(--secondary-color);
            backdrop-filter: blur(10px);
        `;
        
        voicePanel.innerHTML = `
            <!-- Header -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 6px;">
                    <i class="fas fa-volume-up" style="color: var(--secondary-color); font-size: 1em;"></i>
                    <h3 style="margin: 0; font-size: 0.85em; font-weight: 600;">Voice Guide</h3>
                </div>
                <button id="closeVoicePanel" style="background: none; border: none; color: white; font-size: 0.9em; cursor: pointer; padding: 2px; border-radius: 3px; transition: background 0.3s;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <!-- Status Display -->
            <div id="voiceStatusDisplay" style="background: rgba(255,255,255,0.1); padding: 6px 8px; border-radius: 5px; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 4px;">
                    <i id="voiceStatusIcon" class="fas fa-volume-up" style="color: var(--secondary-color); font-size: 0.8em;"></i>
                    <span id="voiceStatusText" style="font-weight: 600; font-size: 0.7em;">Ready</span>
                </div>
                <div id="currentVoiceMessage" style="font-size: 0.65em; line-height: 1.2; color: #ecf0f1; margin-top: 3px; max-height: 24px; overflow: hidden;">
                    Click voice button for guidance
                </div>
            </div>
            
            <!-- Quick Actions & Settings Combined -->
            <div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                    <span style="font-size: 0.7em; color: #bdc3c7;">Actions:</span>
                    <button id="toggleVoiceSettings" style="background: none; border: none; color: #bdc3c7; cursor: pointer; font-size: 0.8em; padding: 2px;">
                        <i class="fas fa-cog"></i>
                    </button>
                </div>
                
                <!-- Quick Actions Row -->
                <div style="display: flex; gap: 4px; margin-bottom: 6px;">
                    <button id="voiceWelcomeBtn" class="voice-action-btn">
                        <i class="fas fa-home"></i>
                    </button>
                    <button id="voiceCurrentBtn" class="voice-action-btn">
                        <i class="fas fa-info"></i>
                    </button>
                    <button id="voiceParametersBtn" class="voice-action-btn">
                        <i class="fas fa-sliders-h"></i>
                    </button>
                    <button id="voiceStopBtn" class="voice-action-btn stop-btn">
                        <i class="fas fa-stop"></i>
                    </button>
                </div>
                
                <!-- Compact Settings -->
                <div id="voiceSettingsContent" style="display: none; background: rgba(255,255,255,0.05); padding: 6px; border-radius: 4px;">
                    <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 4px;">
                        <span style="font-size: 0.65em; color: #bdc3c7; min-width: 35px;">Speed:</span>
                        <input type="range" id="voiceSpeechRate" min="0.5" max="2" step="0.1" value="0.9" style="flex: 1;">
                    </div>
                    <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 4px;">
                        <span style="font-size: 0.65em; color: #bdc3c7; min-width: 35px;">Volume:</span>
                        <input type="range" id="voiceSpeechVolume" min="0" max="1" step="0.1" value="0.8" style="flex: 1;">
                    </div>
                    <label style="display: flex; align-items: center; gap: 4px; font-size: 0.65em; color: #bdc3c7;">
                        <input type="checkbox" id="voiceAutoAnnounce" checked style="transform: scale(0.8);">
                        Auto-announce
                    </label>
                </div>
            </div>
        `;
        
        document.body.appendChild(voicePanel);
        
        // Add voice panel styles
        const voicePanelStyles = document.createElement('style');
        voicePanelStyles.textContent = `
            .voice-action-btn {
                background: rgba(52, 152, 219, 0.8);
                color: white;
                border: none;
                padding: 6px;
                border-radius: 4px;
                font-size: 0.75em;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                flex: 1;
                min-width: 0;
            }
            .voice-action-btn:hover {
                background: var(--secondary-color);
                transform: translateY(-1px);
            }
            .voice-action-btn.stop-btn {
                background: var(--accent-color);
            }
            .voice-action-btn.stop-btn:hover {
                background: #c0392b;
            }
            
            #voiceGuidePanel input[type="range"] {
                -webkit-appearance: none;
                appearance: none;
                height: 2px;
                background: rgba(255,255,255,0.3);
                border-radius: 1px;
                outline: none;
            }
            
            #voiceGuidePanel input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 10px;
                height: 10px;
                background: var(--secondary-color);
                border-radius: 50%;
                cursor: pointer;
            }
            
            #closeVoicePanel:hover {
                background: rgba(255,255,255,0.1);
            }
        `;
        document.head.appendChild(voicePanelStyles);
        
        // Setup event listeners for the voice panel
        this.setupVoicePanelListeners();
    }

    setupVoicePanelListeners() {
        // Close button
        document.getElementById('closeVoicePanel').addEventListener('click', () => {
            this.hideVoiceGuide();
        });
        
        // Quick action buttons
        document.getElementById('voiceWelcomeBtn').addEventListener('click', () => {
            this.speak(this.voiceInstructions.welcome);
        });
        
        document.getElementById('voiceCurrentBtn').addEventListener('click', () => {
            this.speakCurrentSection();
        });
        
        document.getElementById('voiceParametersBtn').addEventListener('click', () => {
            this.speak(this.voiceInstructions.parameters);
        });
        
        document.getElementById('voiceStopBtn').addEventListener('click', () => {
            this.stopSpeech();
        });
        
        // Settings toggle
        document.getElementById('toggleVoiceSettings').addEventListener('click', () => {
            const settingsContent = document.getElementById('voiceSettingsContent');
            const isVisible = settingsContent.style.display !== 'none';
            settingsContent.style.display = isVisible ? 'none' : 'block';
        });
        
        // Settings controls
        document.getElementById('voiceSpeechRate').addEventListener('input', (e) => {
            this.speechRate = parseFloat(e.target.value);
        });
        
        document.getElementById('voiceSpeechVolume').addEventListener('input', (e) => {
            this.speechVolume = parseFloat(e.target.value);
        });
        
        document.getElementById('voiceAutoAnnounce').addEventListener('change', (e) => {
            this.autoAnnounceChanges = e.target.checked;
        });
    }

    toggleVoiceGuide() {
        const panel = document.getElementById('voiceGuidePanel');
        const button = document.getElementById('voiceToggleButton');
        const isVisible = panel.style.visibility === 'visible';
        
        if (isVisible) {
            this.hideVoiceGuide();
        } else {
            this.showVoiceGuide();
        }
    }

    showVoiceGuide() {
        const panel = document.getElementById('voiceGuidePanel');
        const button = document.getElementById('voiceToggleButton');
        
        panel.style.visibility = 'visible';
        panel.style.opacity = '1';
        panel.style.transform = 'translateY(0) scale(1)';
        
        // Update button appearance
        button.style.background = 'linear-gradient(135deg, var(--success-color), #27ae60)';
        button.querySelector('i').className = 'fas fa-volume-down';
        
        // Update message if there's current speech
        this.updateVoiceStatus();
    }

    hideVoiceGuide() {
        const panel = document.getElementById('voiceGuidePanel');
        const button = document.getElementById('voiceToggleButton');
        
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(20px) scale(0.95)';
        panel.style.visibility = 'hidden';
        
        // Reset button appearance
        button.style.background = 'linear-gradient(135deg, var(--secondary-color), #2980b9)';
        button.querySelector('i').className = 'fas fa-volume-up';
    }

    updateVoiceStatus(status = 'Ready', message = null) {
        const statusText = document.getElementById('voiceStatusText');
        const statusIcon = document.getElementById('voiceStatusIcon');
        const messageElement = document.getElementById('currentVoiceMessage');
        
        if (statusText) statusText.textContent = status;
        if (messageElement && message) messageElement.textContent = message;
        
        // Update icon based on status
        if (statusIcon) {
            switch(status) {
                case 'Speaking...':
                    statusIcon.className = 'fas fa-volume-up';
                    statusIcon.style.color = 'var(--success-color)';
                    break;
                case 'Error':
                    statusIcon.className = 'fas fa-exclamation-triangle';
                    statusIcon.style.color = 'var(--accent-color)';
                    break;
                default:
                    statusIcon.className = 'fas fa-volume-up';
                    statusIcon.style.color = 'var(--secondary-color)';
            }
        }
    }

    addVoiceButtonsToSections() {
        // Add voice buttons to section headers
        const sections = [
            { id: 'theory', instruction: 'theory' },
            { id: 'experiment', instruction: 'experiment' },
            { id: 'results', instruction: 'results' }
        ];
        
        sections.forEach(section => {
            const sectionElement = document.getElementById(section.id);
            if (sectionElement) {
                const header = sectionElement.querySelector('.section-header h2');
                if (header) {
                    const voiceBtn = document.createElement('button');
                    voiceBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                    voiceBtn.className = 'voice-section-btn';
                    voiceBtn.style.cssText = `
                        background: var(--info-color);
                        color: white;
                        border: none;
                        padding: 8px 10px;
                        border-radius: 50%;
                        margin-left: 15px;
                        cursor: pointer;
                        font-size: 0.9em;
                        transition: all 0.3s ease;
                    `;
                    voiceBtn.addEventListener('click', () => {
                        this.speak(this.voiceInstructions[section.instruction]);
                    });
                    header.appendChild(voiceBtn);
                }
            }
        });
        
        // Add voice buttons to toggle sections
        const toggleButtons = [
            { id: 'toggleGuide', instruction: 'procedure' },
            { id: 'toggleFormulas', instruction: 'formulas' },
            { id: 'toggleAnalysis', instruction: 'analysis' }
        ];
        
        toggleButtons.forEach(btn => {
            const buttonElement = document.getElementById(btn.id);
            if (buttonElement) {
                const voiceBtn = document.createElement('button');
                voiceBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                voiceBtn.className = 'voice-toggle-btn';
                voiceBtn.style.cssText = `
                    background: var(--warning-color);
                    color: white;
                    border: none;
                    padding: 6px 8px;
                    border-radius: 4px;
                    margin-left: 10px;
                    cursor: pointer;
                    font-size: 0.8em;
                    transition: all 0.3s ease;
                `;
                voiceBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.speak(this.voiceInstructions[btn.instruction]);
                });
                buttonElement.parentNode.appendChild(voiceBtn);
            }
        });
    }

    speak(text) {
        if (!this.voiceEnabled || !this.speechSynthesis) return;
        
        // Stop any current speech
        this.stopSpeech();
        
        // Update voice guide if it's visible
        this.updateVoiceStatus('Speaking...', text);
        
        // Create new speech
        this.currentSpeech = new SpeechSynthesisUtterance(text);
        this.currentSpeech.rate = this.speechRate || 0.9;
        this.currentSpeech.pitch = 1;
        this.currentSpeech.volume = this.speechVolume || 0.8;
        
        // Try to use a female voice
        const voices = this.speechSynthesis.getVoices();
        
        // First priority: Look for specific female voice names
        let preferredVoice = voices.find(voice => 
            voice.name.includes('Samantha') ||
            voice.name.includes('Victoria') ||
            voice.name.includes('Karen') ||
            voice.name.includes('Susan') ||
            voice.name.includes('Google UK English Female') ||
            voice.name.includes('Microsoft Zira') ||
            voice.name.includes('Microsoft Hazel') ||
            voice.name.includes('Fiona') ||
            voice.name.includes('Female') ||
            voice.name.includes('Woman')
        );
        
        // Second priority: Look for voices that typically indicate female voices
        if (!preferredVoice) {
            preferredVoice = voices.find(voice => 
                (voice.lang.includes('en') && 
                (voice.name.toLowerCase().includes('female') ||
                 voice.name.toLowerCase().includes('woman') ||
                 voice.name.toLowerCase().includes('zira') ||
                 voice.name.toLowerCase().includes('hazel') ||
                 voice.name.toLowerCase().includes('eva') ||
                 voice.name.toLowerCase().includes('samantha')))
            );
        }
        
        // Third priority: Any English voice (may be male or female)
        if (!preferredVoice) {
            preferredVoice = voices.find(voice => 
                voice.lang.includes('en') || 
                voice.name.includes('Google')
            );
        }
        
        if (preferredVoice) {
            this.currentSpeech.voice = preferredVoice;
        }
        
        // Visual feedback
        this.showSpeechIndicator(true);
        
        this.currentSpeech.onstart = () => {
            this.updateVoiceStatus('Speaking...', text);
        };
        
        this.currentSpeech.onend = () => {
            this.showSpeechIndicator(false);
            this.updateVoiceStatus('Ready', 'Voice guidance completed.');
            this.currentSpeech = null;
        };
        
        this.currentSpeech.onerror = () => {
            this.showSpeechIndicator(false);
            this.updateVoiceStatus('Error', 'Speech synthesis error occurred.');
            this.currentSpeech = null;
        };
        
        this.speechSynthesis.speak(this.currentSpeech);
        this.lastSpokenText = text;
    }

    stopSpeech() {
        if (this.speechSynthesis) {
            this.speechSynthesis.cancel();
        }
        if (this.currentSpeech) {
            this.currentSpeech = null;
        }
        this.showSpeechIndicator(false);
        this.updateVoiceStatus('Ready', 'Voice guidance stopped.');
    }

    showSpeechIndicator(speaking) {
        const indicator = document.getElementById('speechIndicator') || this.createSpeechIndicator();
        if (speaking) {
            indicator.style.display = 'flex';
            indicator.innerHTML = `
                <i class="fas fa-volume-up" style="color: var(--success-color); animation: pulse 1s infinite;"></i>
                <span style="margin-left: 8px; color: var(--success-color); font-weight: 600;">Speaking...</span>
            `;
        } else {
            indicator.style.display = 'none';
        }
    }

    createSpeechIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'speechIndicator';
        indicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(39, 174, 96, 0.1);
            border: 2px solid var(--success-color);
            border-radius: 25px;
            padding: 10px 20px;
            display: none;
            align-items: center;
            z-index: 1001;
            backdrop-filter: blur(10px);
            font-size: 0.9em;
        `;
        document.body.appendChild(indicator);
        return indicator;
    }

    speakCurrentSection() {
        const activeSection = document.querySelector('.content-section.active');
        if (activeSection) {
            const sectionId = activeSection.id;
            if (this.voiceInstructions[sectionId]) {
                this.speak(this.voiceInstructions[sectionId]);
            }
        }
    }

    speakParameterGuidance() {
        this.speak(this.voiceInstructions.parameters);
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

        // Voice announcement for experiment start
        if (this.voiceEnabled) {
            this.speak(this.voiceInstructions.experimentStart);
        }

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

        // Announce experiment status after 3 seconds
        setTimeout(() => {
            if (this.isRunning && this.voiceEnabled) {
                this.speak(this.voiceInstructions.experimentRunning);
            }
        }, 3000);
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

        // Voice announcement for experiment completion
        if (this.voiceEnabled) {
            this.speak(this.voiceInstructions.experimentComplete);
            
            // Announce performance results
            setTimeout(() => {
                this.announcePerformanceResults();
            }, 3000);
        }

        // Show completion message
        this.showNotification('Experiment completed successfully! Results are now stable.', 'success');
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

        // Voice announcement for reset
        if (this.voiceEnabled) {
            this.speak(this.voiceInstructions.experimentReset);
        }

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

    announceParameterChange(parameter, value) {
        if (!this.voiceEnabled || !this.autoAnnounceChanges) return;
        
        // Debounce parameter announcements to avoid too many voice messages
        clearTimeout(this.parameterTimeout);
        this.parameterTimeout = setTimeout(() => {
            let announcement = "";
            switch(parameter) {
                case 'steamTemp':
                    announcement = `Steam temperature set to ${value} degrees Celsius. ${this.voiceInstructions.steamTempGuidance}`;
                    break;
                case 'feedRate':
                    announcement = `Feed rate set to ${value} kilograms per hour. ${this.voiceInstructions.feedRateGuidance}`;
                    break;
                case 'concentration':
                    announcement = `Feed concentration set to ${value} percent. ${this.voiceInstructions.concentrationGuidance}`;
                    break;
                case 'targetConc':
                    announcement = `Target product concentration set to ${value} percent. ${this.voiceInstructions.targetConcGuidance}`;
                    break;
                case 'coolingWater':
                    announcement = `Cooling water flow set to ${value} liters per hour. ${this.voiceInstructions.coolingWaterGuidance}`;
                    break;
            }
            if (announcement) {
                this.speak(announcement);
            }
        }, 1000); // 1 second delay to avoid rapid announcements
    }

    speakProcedureStep(stepNumber) {
        if (stepNumber >= 1 && stepNumber <= this.voiceInstructions.procedureSteps.length) {
            this.speak(this.voiceInstructions.procedureSteps[stepNumber - 1]);
        }
    }

    announcePerformanceResults() {
        const steamEconomy = parseFloat(document.getElementById('steamEconomy').textContent);
        const thermalEfficiency = parseInt(document.getElementById('thermalEfficiency').textContent);
        
        let performanceMessage = "";
        
        if (steamEconomy >= 3.0 && thermalEfficiency >= 85) {
            performanceMessage = this.voiceInstructions.resultHigh;
        } else if (steamEconomy >= 2.5 && thermalEfficiency >= 75) {
            performanceMessage = this.voiceInstructions.resultMedium;
        } else {
            performanceMessage = this.voiceInstructions.resultLow;
        }
        
        const detailedResults = `The steam economy achieved is ${steamEconomy} kilograms per kilogram, and thermal efficiency is ${thermalEfficiency} percent. ${performanceMessage}`;
        
        this.speak(detailedResults);
    }
}

// Initialize the virtual lab when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const lab = new MultiEffectEvaporatorLab();
    
    // Add welcome message with voice guidance
    setTimeout(() => {
        lab.showNotification('Welcome to the Multi-Effect Evaporator Virtual Lab! 🎧 Click the voice button (bottom-left) to access audio guidance and controls.', 'info');
    }, 1000);
    
    // Auto-play welcome voice guidance after a short delay
    setTimeout(() => {
        if (lab.voiceEnabled) {
            lab.speak(lab.voiceInstructions.welcome);
        }
    }, 2000);
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
