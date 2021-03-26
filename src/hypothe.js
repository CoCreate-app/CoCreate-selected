	function activate(ds, el) {
	    if (ds["selected_attribute"])
	        el.setAttribute(ds["selected_attribute"], ds["selected"]);
	    else {
	        el.classList.add(ds["selected"]);
	        el.setAttribute('selected', '')
	    }
	}
	function deactiave(ds, el) {
	    if (ds["selected_attribute"])
	        el.removeAttribute(ds["selected_attribute"], ds["selected"]);
	    else {
	        el.classList.remove(ds["selected"]);
	        el.removeAttribute('selected', '');
	    }
	}
	function getSelected(el) {
	    while (!el.dataset['selected'])
	        if (el.parentElement)
	            el = el.parentElement;
	        else
	            return false;
	    return el;

	}
	document.addEventListener("click", (e) => {
	    let el = getSelected(e.target);
	    if (!el) return;
	    let ds = el.dataset;
	    let group = ds['selected_group'] ? `,[data-selected_group="${ds["selected_group"] || 'null'}"]` : ''
	    document.querySelectorAll(` [data-selected]:not([data-selected_group])${group}`).forEach((el) => {
	            let ds = el.dataset;
	            deactiave(el.dataset, el)
	            if (ds["selected_target"])
	                document.querySelectorAll(ds["selected_target"]).forEach((el) => deactiave(ds, el));
	        });
	    activate(ds, el);
	    if (ds["selected_target"])
	        document.querySelectorAll(ds["selected_target"]).forEach((el) => activate(ds, el));
	});