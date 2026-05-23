/**
 * Generic Location Dropdown Helper
 * Handles fetching and populating cascading Country -> State -> City dropdowns.
 */
class LocationDropdownHelper {
    constructor(options) {
        this.countrySelect = document.getElementById(options.countryId);
        this.stateSelect = document.getElementById(options.stateId);
        this.citySelect = document.getElementById(options.cityId);
        this.defaultText = options.defaultText || { country: 'Select Country', state: 'Select State', city: 'Select City' };
        
        // Use value matching by default if no data-id is needed
        this.useValueAsId = options.useValueAsId || false;

        this.attachListeners();
        this.init();
    }

    attachListeners() {
        if (this.countrySelect) {
            this.countrySelect.addEventListener('change', () => this.handleCountryChange());
        }
        if (this.stateSelect) {
            this.stateSelect.addEventListener('change', () => this.handleStateChange());
        }
    }

    async init() {
        if (this.countrySelect) {
            await this.loadCountries();
        }
    }

    async loadCountries() {
        try {
            const res = await fetch('/api/locations/countries/active');
            if (!res.ok) throw new Error('Failed to fetch countries');
            const countries = await res.json();
            
            this.countrySelect.innerHTML = `<option value="">${this.defaultText.country}</option>` + 
                countries.map(c => {
                    const val = this.useValueAsId ? c.id : c.name;
                    return `<option value="${val}" data-id="${c.id}" data-phonecode="${c.phonecode || ''}">${c.name}</option>`;
                }).join("");
            
            this.resetSelect(this.stateSelect, this.defaultText.state);
            this.resetSelect(this.citySelect, this.defaultText.city);
        } catch(e) {
            console.error('LocationHelper: Error loading countries', e);
            if(this.countrySelect) this.countrySelect.innerHTML = `<option value="">Error Loading</option>`;
        }
    }

    async handleCountryChange() {
        if (!this.stateSelect && !this.citySelect) return;
        
        const selected = this.countrySelect.options[this.countrySelect.selectedIndex];
        const countryId = selected?.getAttribute('data-id');
        
        this.resetSelect(this.citySelect, this.defaultText.city);

        if (countryId && this.stateSelect) {
            this.stateSelect.disabled = false;
            this.stateSelect.innerHTML = `<option value="">Loading states...</option>`;
            try {
                const res = await fetch(`/api/locations/states/country/${countryId}`);
                if (!res.ok) throw new Error('Failed to fetch states');
                const states = await res.json();
                
                this.stateSelect.innerHTML = `<option value="">${this.defaultText.state}</option>` + 
                    states.map(s => {
                        const val = this.useValueAsId ? s.id : s.name;
                        return `<option value="${val}" data-id="${s.id}">${s.name}</option>`;
                    }).join("");
            } catch(e) {
                console.error('LocationHelper: Error loading states', e);
                this.resetSelect(this.stateSelect, 'Error Loading');
            }
        } else {
            this.resetSelect(this.stateSelect, this.defaultText.state);
        }

        // Trigger change to let external scripts know
        this.countrySelect.dispatchEvent(new CustomEvent('locationChanged', { detail: { type: 'country' } }));
        // Manually trigger standard change for onchange inline handlers
        if(this.countrySelect.onchange && !this.countrySelect.dataset.helperHandled) {
            // We set dataset to avoid infinite loops if onchange calls us
        }
    }

    async handleStateChange() {
        if (!this.citySelect) return;
        
        const selected = this.stateSelect.options[this.stateSelect.selectedIndex];
        const stateId = selected?.getAttribute('data-id');
        
        if (stateId) {
            this.citySelect.disabled = false;
            this.citySelect.innerHTML = `<option value="">Loading cities...</option>`;
            try {
                const res = await fetch(`/api/locations/cities/state/${stateId}`);
                if (!res.ok) throw new Error('Failed to fetch cities');
                const cities = await res.json();
                
                this.citySelect.innerHTML = `<option value="">${this.defaultText.city}</option>` + 
                    cities.map(c => {
                        const val = this.useValueAsId ? c.id : c.name;
                        return `<option value="${val}" data-id="${c.id}">${c.name}</option>`;
                    }).join("");
            } catch(e) {
                console.error('LocationHelper: Error loading cities', e);
                this.resetSelect(this.citySelect, 'Error Loading');
            }
        } else {
            this.resetSelect(this.citySelect, this.defaultText.city);
        }

        this.stateSelect.dispatchEvent(new CustomEvent('locationChanged', { detail: { type: 'state' } }));
    }

    resetSelect(element, defaultText) {
        if (!element) return;
        element.innerHTML = `<option value="">${defaultText}</option>`;
        element.disabled = true;
    }
    
    // Method to manually select values (useful for edit modes)
    async selectValues(countryIdOrName, stateIdOrName, cityIdOrName) {
        if (this.countrySelect && countryIdOrName) {
            this.countrySelect.value = countryIdOrName;
            await this.handleCountryChange();
            
            if (this.stateSelect && stateIdOrName) {
                this.stateSelect.value = stateIdOrName;
                await this.handleStateChange();
                
                if (this.citySelect && cityIdOrName) {
                    this.citySelect.value = cityIdOrName;
                }
            }
        }
    }
}

window.LocationDropdownHelper = LocationDropdownHelper;
