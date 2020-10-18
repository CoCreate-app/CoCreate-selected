// let list_data_toogles = document.querySelectorAll('[data-toggle]');

// list_data_toogles.forEach(elem=>{
    
//     elem.addEventListener("click",function(e){
//         let value = elem.dataset['toggle'];
//         let toggle_closest = elem.dataset['toggle_closest'];
//         if(typeof(toggle_closest) != 'undefined'){
//             let list_toggle_closest = elem.closest(toggle_closest);
//             if(list_toggle_closest)
//                 if(Array.isArray(list_toggle_closest))
//                     list_toggle_closest.forEach(el=>{
//                         ToogleClass(el,value);
//                     });
//                 else
//                     ToogleClass(list_toggle_closest,value);
//         }else{
//             ToogleClass(elem,value);
//         }
//     });
    
// });

// function ToogleClass(elem,clase){
//     if(elem.classList.contains(clase))
//         elem.classList.remove(clase)
//     else
//         elem.classList.add(clase)
// }




let list_data_toogles = document.querySelectorAll('[data-selected]');

list_data_toogles.forEach(elem=>{
     elem.addEventListener("click",function(e){
        let values = elem.dataset['selected'].split(',').map(function(x){return x.trim()});
        let target = elem.dataset['selected_attribute'] ? elem.dataset['selected_attribute'] : 'class';
        let group = elem.dataset['selected_group'] ? '[data-selected_group="'+elem.dataset['selected_group']+'"]' : ':not([data-selected_group])';
        console.log(values)
        /*Diselected*/
        let before_element = document.querySelector('[data-selected]'+group+'[selected]');
        //console.log('[data-selected]'+group+'[selected]',before_element)
        if(before_element){
            let b_values = before_element.dataset['selected'].split(',').map(function(x){return x.trim()});
            let b_target = before_element.dataset['selected_attribute'] ? before_element.dataset['selected_attribute'] : 'class';
            let array_2 = before_element.getAttribute(b_target).split(' ').map(function(x){return x.trim()});
            let  toggle_tmp = get_val_toggle_attributes(b_values,array_2);
            let tmp_val = get_value(b_values,toggle_tmp);
            change_values(b_target,toggle_tmp,b_values,tmp_val,before_element);
        }
        let elem_change = elem;
        let array_2 = elem.getAttribute(target).split(' ').map(function(x){return x.trim()});
        let  toggle_tmp = get_val_toggle_attributes(values,array_2);
        let tmp_val = get_value(values,toggle_tmp);
        if(change_values(target,toggle_tmp,values,tmp_val,elem_change))
            return
        
    });//end click
});//end for


function get_val_toggle_attributes(values,array_2){
    
    var array_first = values;
    var array_second = array_2;
    
    var array_intersection = array_first.filter(function(x) {
    	// checking second array contains the element "x"
    	if(array_second.indexOf(x) != -1)
    		return true;
    	else
    		return false;
    });
    let retorno = (array_intersection.length ) ? array_intersection[0] : '';
    
    return retorno
    //console.log("Intercept ",array_intersection);
}

function change_values(target,toggle_tmp,values,tmp_val,elem_change){
    attrSelected(elem_change);
    if(target=='class' && toggle_tmp!=''){
            elem_change.classList.remove(toggle_tmp)
            if(values.length==1){
                return true
            }
        }
        if(target=='class' ){
            if(tmp_val!='')
                elem_change.classList.add(tmp_val)
        }else{
            if(elem_change.getAttribute(target) == tmp_val){
                elem_change.removeAttribute(target);
            }else{
                elem_change.setAttribute(target, tmp_val);
            }
        }
        return false
}

function attrSelected(elem_change){
        if(elem_change.getAttribute('selected')!=null){
             elem_change.removeAttribute('selected')
         }else{
             elem_change.setAttribute('selected','')
         }
}

function get_value(values,val){
    let my_val = values[0];
    if(values.length>1 && val != ''){
        let tmp = values.indexOf(val);
        if((tmp+1)<values.length)
            my_val = values[tmp+1];
    }
    return my_val;
}