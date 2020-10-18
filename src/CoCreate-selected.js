const CoCreateSelected = {

	init: function() {
		this.initElement(document);
	},
	
	initElement: function(container) {
		let mainContainer = container || document;

		if (!mainContainer.querySelectorAll) {
			return;
		}
		
		let elements = mainContainer.querySelectorAll(`[data-selected]`);
		if (elements.length === 0 && mainContainer != document && mainContainer.hasAttributes(`[data-selected]`)) {
			elements = [mainContainer];
		}
		
		elements.forEach((element) => this.__initElementEvent(element));
	},
	
	__initElementEvent: function(element) {
		
		
		let values = element.dataset['selected'].split(',');
		if (!values || values.length === 0) {
			return;
		}
		values = values.map(x => x.trim())
		
		element.addEventListener('click', function() {
			this.__changeElementStatus(element, values)
		});
		
		document.addEventListener('click', function(event) {
			if (!element.hasAttribute("data-selected_group") && !element.contains(event.target)) {
				
				this.__removeSelectedStatus(element, values);
			}//
		})
	},
	
	__changeElementStatus: function(element, values) {
		let target_attribute = element.dataset[`selected_attribute`] || 'class'; 
		let elements = this.__getTargetElements(element);

		let selectedGroup = element.dataset['selected_group'];
		let group = selectedGroup ? `[data-selected_group="${selectedGroup}"]` : ':not([data-selected_group])';

		let previouSelected = document.querySelector('[data-selected]' + group + '[selected]');
		
		if (previouSelected) {
			let previousValues = previouSelected.dataset['selected'].split(',').map(x => x.trim());
            let previousTargetAttr = previouSelected.dataset['selected_attribute'] || 'class';
			this.setValue(previouSelected, previousTargetAttr, previousValues);
		}
		
		values = values.map(x => x.trim());
		elements.forEach((el) => {
			this.setValue(el, target_attribute, values);
		})
	},
	
	__removeSelectedStatus: function(element, values) {
		let attrName = element.dataset[`selected_attribute`] || 'class';

		let currentAttrValue = element.getAttribute(attrName) || "";
		let attrValues = currentAttrValue;
		
		let elements = this.__getTargetElements(element);
		
		elements.forEach(el => {
			if (attrName === 'class') {
				attrValues = currentAttrValue.split(' ').map(x => x.trim());
				let currentValue = values.filter(x => attrValues.includes(x))[0] || '';
				if (currentValue) {
					el.classList.remove(currentValue);
				}
			} else {
				el.setAttribute(attrName, "");
			}
			el.removeAttribute('selected');
		})
		
	},
	
	setValue: function(element, attrName, values) {
		element.toggleAttribute("selected");
		let currentAttrValue = element.getAttribute(attrName) || ""; 
		let attrValues = currentAttrValue;
		if (attrName === 'class') {
			attrValues = currentAttrValue.split(' ').map(x => x.trim());
		}
		
		let oldValue = values.filter(x => attrValues.includes(x))[0] || '';
		let newValue = this.__getNextValue(values, oldValue)
		
		if (attrName === 'class') {
			if (oldValue != '') {
				element.classList.remove(oldValue);
				if (values.length === 1) {
					return;
				}
			}
			
			if (newValue != '') {
				element.classList.add(newValue);
			}
		} else {
			element.setAttribute(attrName, newValue);
		}
	},
	
	__getTargetElements: function(element) {
		let targetSelector = element.dataset[`selected_element`];
		let elements = [element];
		if (targetSelector) {
			elements = Array.from(document.querySelectorAll(targetSelector));
			elements.push(element)
		}
		return elements;
	},

	__getNextValue: function(values, val) {
		let size = values.length;
		let nn = values.indexOf(val);
		if (nn == -1) {
			return values[0];
		} else {
			return values[(nn + 1) % size];
		}
	}
}

CoCreateSelected.init();