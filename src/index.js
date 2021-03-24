
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
		if (elements.length === 0 && mainContainer != document && mainContainer.hasAttribute(`[data-selected]`)) {
			elements = [mainContainer];
		}
		const self = this;
		elements.forEach((element) => self.__initElementEvent(element));
	},
	
	__initElementEvent: function(element) {
		const selectedValue = element.getAttribute('data-selected') || "";
		let values = selectedValue.split(',');
		if (!values || values.length === 0) {
			return;
		}
		values = values.map(x => x.trim())
		
		const self = this;
		
		// if (CoCreate.observer.getInitialized(element)) {
		// 	return;
		// }
		// CoCreate.observer.setInitialized(element)
		element['co_initialized_'] = true;
		
		element.addEventListener('click', function() {
			self.__changeElementStatus(element, values)
		});
		
		document.addEventListener('click', function(event) {
			if (!element.hasAttribute("data-selected_group") && !element.contains(event.target)) {
				
				self.__removeSelectedStatus(element, values);
			}
		})
	},
	
	__changeElementStatus: function(element, values) {
		let target_attribute = element.dataset[`selected_attribute`] || 'class'; 
		let elements = this.__getTargetElements(element);
		const self = this;

		let selectedGroup = element.dataset['selected_group'];
		let group = selectedGroup ? `[data-selected_group="${selectedGroup}"]` : ':not([data-selected_group])';

		let previouSelected = document.querySelector('[data-selected]' + group + '[selected]');
		
		// if (previouSelected.isSameNode(element)) {
		// 	return ;
		// }
		
		if (previouSelected) {
			let previousValues = previouSelected.dataset['selected'].split(',').map(x => x.trim());
			this.__removeSelectedStatus(previouSelected, previousValues)
		}
		
		values = values.map(x => x.trim());
		elements.forEach((el) => {
			self.setValue(el, target_attribute, values);
		})
	},
	
	__removeSelectedStatus: function(element, values) {
		let attrName = element.dataset[`selected_attribute`] || 'class';
		
		let elements = this.__getTargetElements(element);
		
		elements.forEach(el => {
			if (attrName === 'class') {
				let attrValues = (el.getAttribute(attrName) || "").split(' ').map(x => x.trim());
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
		let currentAttrValue = element.getAttribute(attrName) || ""; 
		let attrValues = currentAttrValue;
		if (attrName === 'class') {
			attrValues = currentAttrValue.split(' ').map(x => x.trim());
		}
		
		let oldValue = values.filter(x => attrValues.includes(x))[0] || '';
		let newValue = this.__getNextValue(values, oldValue)
	
		element.setAttribute('selected', "")
		
		if (oldValue === newValue) {
			return;
		}
		
		if (attrName === 'class') {
			if (oldValue != '') {
				element.classList.remove(oldValue);
			}
			if (newValue != '') {
				element.classList.add(newValue);
			}
		} else {
			element.setAttribute(attrName, newValue);
		}
	},
	
	__getTargetElements: function(element) {
		let targetSelector = element.dataset[`selected_target`];
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
	},
	
	config: function({
			srcDocument,
			destDocument,
			wrap,
			callback = ()=>'',
			selector,
			target,
			srcAttribute,
			destAttribute,
			type = "post",
			eventType = "click",
		}) 
	{
	console.log('config executed', {
			srcDocument,
			destDocument,
			wrap,
			callback ,
			selector,
			target,
			srcAttribute,
			destAttribute,
			type ,
			eventType ,
		})
		srcDocument.addEventListener(eventType, (e) => {
			if (e.target.matches(selector) || (srcAttribute && e.target.hasAttribute(srcAttribute))) {
				let targets = destDocument.querySelectorAll(target);
				targets.forEach((target) => {
					let value = e.target.getAttribute(srcAttribute);
					if (wrap) value = wrap.replace("$1", value);
					if(destAttribute)
					target.setAttribute(destAttribute, value);
					callback(e.target, target)
				});
			}
			if (type === "cut") e.target.removeAttribute(srcAttribute);
		});	
	}
}

CoCreateSelected.init();

// CoCreate.observer.init({ 
// 	name: 'CoCreateSelected', 
// 	observe: ['subtree', 'childList'],
// 	include: '[data-selected]', 
// 	callback: function(mutation) {
// 		CoCreateSelected.initElement(mutation.target)
// 	}
// });

export default CoCreateSelected;

