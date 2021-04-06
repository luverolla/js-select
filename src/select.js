/**
 * @typedef {Object} Locale
 * @property {string} SEARCH
 * @property {string} NO_RESULT
 * @property {string} PLACEHOLDER_SINGLE
 * @property {string} PLACEHOLDER_MULTI
 */ 

/**
 * @typedef {Object} Option - select option object
 * @property {number} key - option's key
 * @property {string} title - option's main text
 * @property {string} value - option's value
 * @property {string} img - option's image path
 * @property {string} desc - option's description
 * @property {string} group - option's group
 * @property {boolean} disabled - indicates if option is disabled
 * @property {boolean} selected - indicates if option is selected
 */

/**
 * @type {Locale[]}
 */
const S_LOCALES = window.S_LOCALES;

const S_PREFIX = "jselect";

const S_TRIGGER = `[data-replace=${S_PREFIX}]`;

/**
 * Convert from rem to pixels based on current document's font size
 * @param {number} rem 
 */
function rem2px(rem) 
{
	var style = window.getComputedStyle(document.body, null).getPropertyValue('font-size');
	var fontSize = parseFloat(style);

	return rem * fontSize;
}


/**
 * Pure JavaScript (VanillaJS) dropdown menu, with multiple select and searching support
 * @class
 * @public
 * @constructor
 */
class Select
{
    /**
     * Original HTML '<select>' element
     * @type {HTMLSelectElement}
     */
    old;

    /**
     * Select DOM element
     * @type {HTMLDivElement}
     */
    el;

    /**
     * Element's name
     * @type {string}
     */
    name;

    /**
     * Element's ID
     * @type {string}
     */
    id;

    /**
     * Options array
     * @type {Option[]}
     */
    options;

    /**
     * Current option value
     * @type {string}
     */
    value;

    /**
     * Shown options array (based on search key)
     * @type {Option[]}
     */
    shown;

    /**
     * Current focused option
     * @type {Option}
     */
    curr;

    /**
     * Current locale
     * @type {Locale}
     */
    locale;

    /**
     * Tells if Select should have searching feature
     * @type {boolean}
     */
    hasSearch;

    /**
     * Tells if Select's list is expanded
     * @type {boolean}
     */
    isOpen;

    /**
     * Tells if Select is disabled
     * @type {boolean}
     */
    disabled;

    /**
     * Placeholder string
     * @type {string}
    */
    placeholder;

    /**
     * Tells if user can select multiple options
     * @param {boolean} multiple 
    */


    /**
     * The original HTML '<select>' element 
     * @param {HTMLSelectElement} old 
    */
	constructor(old)
	{
        this.isOpen = false;
		this.locale = S_LOCALES[old.dataset.locale];
        this.multiple = old.dataset.multiple;
		this.hasSearch = old.dataset.search;
		this.disabled = old.disabled;
        this.value = old.dataset.value || "";
        this.old = old;

        this.name = old.name || (+new Date()).toString();
		this.id = `${S_PREFIX}-${this.name}`;

		this.placeholder = old.dataset.placeholder;
        if(!this.placeholder)
            this.placeholder = this.multiple ? this.locale.PLACEHOLDER_MULTI : this.locale.PLACEHOLDER_SINGLE;

	}

    /**
     * @param {HTMLSelectElement} old 
     */
    reload(old)
    {
        this.isOpen = false;
		this.locale = S_LOCALES[old.dataset.locale];
        this.multiple = old.dataset.multiple;
		this.hasSearch = old.dataset.search;
		this.disabled = old.disabled;
        this.value = old.dataset.value || "";
        this.old = old;

        this.name = old.name.split('_')[0] || (+new Date()).toString();
		this.id = `${S_PREFIX}-${this.name}`;

		this.placeholder = old.dataset.placeholder;
        if(!this.placeholder)
            this.placeholder = this.multiple ? this.locale.PLACEHOLDER_MULTI : this.locale.PLACEHOLDER_SINGLE;
    }

    /**
     * @param {number} key 
     */
    focusOption(key)
    {
        let display = this.el.querySelector(`.${S_PREFIX}__display`),
            search = this.el.querySelector(`.${S_PREFIX}__search`),
            list = this.el.querySelector(`.${S_PREFIX}__list`),
            opts = this.el.querySelectorAll(`.${S_PREFIX}--option`),
            which = this.el.querySelector(`#${this.id}--${key}`);

        this.curr = this.options.find(o => o.key == key);
        list.scrollTop = which.offsetTop - rem2px(5);
        
        opts.forEach(o =>
        {
            let opId = parseInt(o.id[o.id.length - 1]);
            opId == key ? o.classList.add("focus") : o.classList.remove("focus");
        });

        if(this.hasSearch)
            search.setAttribute("aria-activedescendant", which.id);
        display.setAttribute("aria-activedescendant", which.id);

        this.printOptions(this.shown);
    }

    open()
    {
        let display = this.el.querySelector(`.${S_PREFIX}__display`),
            search = this.el.querySelector(`.${S_PREFIX}__search`);

        this.isOpen = true;
        this.el.classList.add("open");
        display.setAttribute("aria-expanded", true);

        if(this.hasSearch)
        {
            search.focus();
            display.tabIndex = -1;
        }

        this.focusOption(1);
    }

    close()
    {
        let display = this.el.querySelector(`.${S_PREFIX}__display`);
        display.removeAttribute("aria-activedescendant");

        this.el.classList.remove("open");
        display.setAttribute("aria-expanded", false);
        display.tabIndex = 0;
        this.isOpen = false;
    }

    focusEvents()
    {
        window.addEventListener("mousedown", e =>
        {
            if(!this.el.contains(e.target))
                this.close();
        });
    }

    isSelected(key)
    {
        return this.options
            .find(o => o.key == key).selected;
    }

    selectOption(key)
    {
        if(!this.options.find(o => o.key).selected)
            this.toggleSelect(key);
    }

    keyboardEvents()
    {
        document.addEventListener("keydown", e =>
        {
            let last = this.shown.length - 1,
                curr = this.shown.indexOf(this.curr);

            switch(e.key)
            {
                case "Enter":
                    e.preventDefault();
                    if(this.el.contains(document.activeElement))
                        this.isOpen ? this.toggleAndClose(this.curr.key) : this.open();
                    break;

                case "Escape":
                    if(this.isOpen)
                        this.close();
                    break;

                case "PageUp":
                    if(this.isOpen)
                    {
                        e.preventDefault();
                        this.keyEvent = true;
                    
                        this.curr = this.shown[0];
                        this.focusOption(this.curr.key);

                        if(!this.multiple && !this.isSelected(this.curr.key))
                            this.toggleSelect(this.curr.key);
                    }
                    break;

                case "PageDown":
                    if(this.isOpen)
                    {
                        e.preventDefault();
                        this.keyEvent = true;
                    
                        this.curr = this.shown[last];
                        this.focusOption(this.curr.key);

                        if(!this.multiple && !this.isSelected(this.curr.key))
                            this.toggleSelect(this.curr.key);
                    }
                    break;

                case "ArrowUp":
                    if(this.isOpen)
                    {
                        e.preventDefault();
                        this.keyEvent = true;

                        if(curr > 0)
                        {
                            this.curr = this.shown[curr - 1];
                            this.focusOption(this.curr.key);

                            if(!this.multiple && !this.isSelected(this.curr.key))
                                this.toggleSelect(this.curr.key);
                        }
                    }
                    break;

                case "ArrowDown":
                    if(this.isOpen)
                    {
                        e.preventDefault();
                        this.keyEvent = true;

                        if(curr < last)
                        {
                            this.curr = this.shown[curr + 1];
                            this.focusOption(this.curr.key);

                            if(!this.multiple && !this.isSelected(this.curr.key))
                                this.toggleSelect(this.curr.key);
                        }
                    }
                    break;
            }
        });
    }

    /**
     * @returns {Option[]}
     */
    getOptions()
    {
        /**
         * @type {Option[]}
         */
        let res = [];
        var i = 0;

        this.old.querySelectorAll(":scope > optgroup").forEach(op =>
        {
            op.querySelectorAll(":scope > option").forEach(ch =>
            {
                i++;

                res.push({
                    key: i,
                    title: ch.innerText.trim(),
                    value: ch.value,
                    img: ch.dataset.img || '',
                    desc: ch.dataset.desc || '',
                    group: op.label,
                    selected: ch.selected,
                    disabled: ch.disabled
                });
            });
        });
            
        this.old.querySelectorAll(":scope > option").forEach(op =>
        {
            i++;

            res.push({
                key: i,
                title: op.innerText.trim(),
                value: op.value,
                img: op.dataset.img || '',
                desc: op.dataset.desc || '',
                selected: op.selected,
                disabled: op.disabled
            });
        });

        return res;
    }

    /**
     * 
     * @param {Option} op 
     * @returns {HTMLLIElement}
     */
    buildSingleOption(op)
    {
        let item = document.createElement("li");
        item.classList.add(`${S_PREFIX}--option`);
        item.setAttribute("role", "option");
        item.id = `${this.el.id}--${op.key}`;

        let body = document.createElement("div");
        body.classList.add(`${S_PREFIX}--option__body`);

        let title = document.createElement("span");
        title.innerHTML = op.title;
        body.appendChild(title);

        let display = this.el.querySelector(`.${S_PREFIX}__display`),
            search = this.el.querySelector(`.${S_PREFIX}__search`);

        if(op.img)
        {
            let img = document.createElement("img");
            img.classList.add(`${S_PREFIX}--option__img`);
            img.src = op.img;
            img.alt = op.title;

            if(op.desc)
                img.style.marginTop = ".3rem";

            item.insertBefore(img, item.firstChild);
        }

        if(op.desc)
        {
            let desc = document.createElement("small");
            desc.innerHTML = op.desc;
            title.style.marginTop = "0px";
            body.appendChild(desc);
        }

        item.appendChild(body);

        if(!op.disabled)
        {
            item.onclick = () => this.toggleAndClose(op.key);
        
            item.onmouseenter = () =>
            {
                if(this.keyEvent)
                {
                    this.keyEvent = false;
                    return;
                }

                let root = this.el.querySelector(`.${S_PREFIX}__list`),
                    targets = root.querySelectorAll(`.${S_PREFIX}--option`);

                targets.forEach(t => t.classList.remove("focus"));
                item.classList.add("focus");

                this.curr = op;

                if(this.hasSearch)
                    if(!!op && !!op.id)
                        search.setAttribute("aria-activedescendant", op.id);

                if(!!op && !!op.id)
                    display.setAttribute("aria-activedescendant", op.id);
            }
        }

        if(op.selected)
        {
            item.classList.add("selected");
            item.setAttribute("aria-selected", true);
        }

        if(op.disabled)
        {
            item.setAttribute("aria-disabled", true);
            item.classList.add("disabled");
        }

        if(this.curr && this.curr.value == op.value)
            item.classList.add("focus");

        return item;
    }

    /**
     * @param {Option[]} options 
     */
    printOptions(options)
    {
        let list = this.el.querySelector(`.${S_PREFIX}__list`);
        list.innerHTML = "";

        let groups = options.map(op => op.group).filter(gr => !!gr);
        groups = [...new Set(groups)];

        // Options with group
        groups.forEach(gr =>
        {
            let grItem = document.createElement("li");
            grItem.classList.add(`${S_PREFIX}__group`);
            grItem.setAttribute("aria-label", gr);
            grItem.setAttribute("role", "none");
            grItem.innerHTML = gr;

            list.appendChild(grItem);

            options.filter(op => op.group == gr).forEach(top =>
                list.appendChild(this.buildSingleOption(top))
            );
        });

        // Options without group
        options.filter(op => !op.group).forEach(op =>
            list.appendChild(this.buildSingleOption(op))
        );
    }

    /**
     * 
     * @param {number} key 
     */
    toggleAndClose(key)
    {
        this.toggleSelect(key);

        if(!this.multiple)
            this.close();
    }

    /**
     * 
     * @param {number} key
     */
    toggleSelect(key)
    {
        /**
         * @type {HTMLInputElement}
         */
        let display = this.el.querySelector(`.${S_PREFIX}__display`),
            search = this.el.querySelector(`.${S_PREFIX}__search`),
            hidden = this.el.querySelector(`.${S_PREFIX}__hidden`),
            dest = this.search ? search : display;

        if(this.multiple)
            dest.focus();

        this.options.forEach(op => 
        {
            if(!this.multiple && op.key != key)
                op.selected = false;
                
            if(op.key == key && !op.disabled)
                op.selected = this.multiple ? !op.selected : true;
        });

        let selected = this.options.filter(op => op.selected);

        if(selected.length == 0)
            display.innerHTML = "<span>" + this.placeholder + "</span>";

        else
            display.innerHTML = selected.map(op => op.title).join(', ');

        hidden.value = selected.map(op => op.value).join(',');

        var evt = new CustomEvent(`${S_PREFIX}-change`);
        hidden.dispatchEvent(evt);

        this.printOptions(this.shown);
    }

    /**
     * @param {string} key 
     */
    doSearch(key)
    {
        key = key.toLowerCase().trim();

        this.shown = this.options.filter(op =>
            (op.group && op.group.toLowerCase().includes(key)) ||
            op.title.toLowerCase().includes(key) ||
            op.value.toLowerCase().includes(key) ||
            op.desc.toLowerCase().includes(key)
        );

        if(this.shown.length == 0)
        {
            let list = this.el.querySelector(`.${S_PREFIX}__list`),
                item = document.createElement("li");

            item.classList.add(`${S_PREFIX}__noresult`);
            item.setAttribute("aria-live", "polite");
            item.innerHTML = this.locale.NO_RESULT;

            list.innerHTML = "";
            list.appendChild(item);
        }

        else
            this.printOptions(this.shown);
    }

    init()
    {
        let existing = document.querySelector(`#${this.id}`);
        if(existing)
            existing.parentElement.removeChild(existing);

        this.keyboardEvents();
        this.focusEvents();

        this.options = this.getOptions();
        this.options.forEach(o => o.selected = false);

		if(this.value.length > 0)
		{
			this.value.split(',').forEach(v =>
			{
				let op = this.options.find(o => o.value === v);
				if(op)
					op.selected = true;
			});
		}

        this.shown = this.options;
        this.curr = this.options.filter(op => !op.disabled)[0];

        this.el = document.createElement("div");
        this.el.classList.add(`${S_PREFIX}`);
        this.el.id = this.id;

        let display = document.createElement("button");
        display.classList.add(`${S_PREFIX}__display`);

        display.type = "button";
        display.setAttribute("role", "combobox");
        display.setAttribute("aria-multiselectable", this.multiple);
        display.setAttribute("aria-label", this.name);
        display.setAttribute("aria-disabled", this.disabled);
        display.setAttribute("aria-expanded", this.isOpen);

        if(!!this.curr && !!this.curr.key)
            display.setAttribute("aria-activedescendant", `${this.el.id}--${this.curr.key}`);

        display.innerHTML = this.options.filter(op => op.selected).map(op => op.title).join(',');
        if(display.innerHTML.length == 0)
            display.innerHTML = "<span>" + this.placeholder + "</span>";

        let hidden = document.createElement("input");
        hidden.classList.add(`${S_PREFIX}__hidden`);
        hidden.setAttribute("aria-hidden", true);

        hidden.tabIndex = -1;
        hidden.readOnly = true;
        hidden.name = this.name;
        hidden.disabled = this.disabled;
        hidden.value = this.options.filter(op => op.selected).map(op => op.value).join(',');

        display.onclick = () =>
        {
            if(this.isOpen)
                this.close();

            else if(!this.disabled)
                this.open();
        };

        this.el.appendChild(display);
        this.el.appendChild(hidden);

        let menu = document.createElement("div");
        menu.classList.add(`${S_PREFIX}__menu`);
        menu.id = `${this.el.id}_menu`;
        
        if(this.hasSearch)
        {
            let search = document.createElement("input");
            search.classList.add(`${S_PREFIX}__search`);
            search.setAttribute("role", "searchbox");
            search.setAttribute("aria-label", this.locale.SEARCH);
            search.setAttribute("aria-autocomplete", "list");
            search.setAttribute("aria-controls", `${this.el.id}_list`);

            if(this.curr && this.curr.key)
                search.setAttribute("aria-activedescendant", `${this.el.id}--${this.curr.key}`);

            search.autocapitalize = "none";
            search.autocomplete = "off";
            search.spellcheck = "off";
            search.placeholder = this.locale.SEARCH;
            search.type = "search";

            search.oninput = () => this.doSearch(search.value);
            menu.appendChild(search);
        }

        if(this.isOpen)
            listCont.tabIndex = 0;

        let list = document.createElement("ul");
        list.classList.add(`${S_PREFIX}__list`);
        list.setAttribute("role", "listbox");
        list.id = `${this.el.id}_list`;
        list.setAttribute("aria-label", this.name);
        list.setAttribute("aria-expanded", this.isOpen);

        display.setAttribute("aria-owns", `${this.el.id}_list`);

        menu.appendChild(list);
        this.el.appendChild(menu);

        this.printOptions(this.options);

        this.old.parentElement.insertBefore(this.el, this.old);

        // avoid conflicts
        if(this.old.name === this.name)
            this.old.name = '_' + this.old.name;

        this.old.style.display = "none";

        let offTop = this.el.offsetTop,
            winHeight = window.innerHeight;

        if(offTop >= .5 * winHeight)
            this.el.classList.add("reverse");

        // if original element changes properties, behave accordingly
        this.old.addEventListener(`${S_PREFIX}-reload`, () =>
        {
            this.reload();
            this.init();
        });

        // custom event to signal DOM that a Select instance has been created
        let evt = new CustomEvent(`${S_PREFIX}-create`);
        window.dispatchEvent(evt);
    }
}

document.addEventListener("DOMContentLoaded", () =>
{
    if(!window[`${S_PREFIX}_ISTANCES`])
        window[`${S_PREFIX}_ISTANCES`] = {};

	document.querySelectorAll(S_TRIGGER).forEach(el =>
    {
        // create
		let ist = new Select(el);

        // store a reference to element
        window[ist.name] = ist;

        // init
        ist.init();
    })
})