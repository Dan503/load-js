interface AllScripts {
	[scriptSource: string]: undefined | Script
}

interface Script {
	hasLoaded: boolean
	callbacks: Array<Function>
}

const alreadyCalledScripts: Array<string> = []

const allScripts: AllScripts = {}
const defaultScript: Script = { hasLoaded: false, callbacks: [] }

const addCallback = (src: string, callback: Function): void => {
	const script = allScripts[src]
	if (!script) return

	if (script.hasLoaded) {
		// If the script has already been previously loaded, just run the callback immediately
		callback()
	} else {
		if (script.callbacks.length > 0) {
			script.callbacks.push(callback)
		} else {
			script.callbacks = [callback]
		}
	}
}

export default function loadJS(src: string, callback: () => void): void {
	const script = allScripts[src] || defaultScript
	allScripts[src] = script
	if (alreadyCalledScripts.indexOf(src) < 0) {
		alreadyCalledScripts.push(src)
		const $scriptElem = document.createElement('script')
		$scriptElem.setAttribute('class', 'load-js-script')
		$scriptElem.src = src
		$scriptElem.onload = (): void => {
			addCallback(src, callback)
			const updatedScript = allScripts[src]
			if (updatedScript) {
				updatedScript.hasLoaded = true
			}
			// setTimeout ensures the script has finished running before attempting to run the callbacks
			setTimeout(() => {
				for (const thisSource in allScripts) {
					const thisScript = allScripts[thisSource] || defaultScript
					thisScript.callbacks.forEach(cb => cb())
				}
			})
		}
		document.head.appendChild($scriptElem)
	} else {
		addCallback(src, callback)
	}
}
