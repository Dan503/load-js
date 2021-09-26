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

let callbackTimeout: NodeJS.Timeout

const runCallbacks = () => {
	const keys = Object.keys(allScripts)
	keys.forEach(source => {
		const thisScript = allScripts[source] || defaultScript
		thisScript.callbacks.forEach(cb => cb())
	})
}

const waitForAllScriptsToBeReady = (onReady: () => void) => {
	let maxTimeReached = false

	const interval = setInterval(() => {
		const scriptSources = Object.keys(allScripts)
		const allHaveLoaded = scriptSources.every(src => allScripts[src]?.hasLoaded)
		if (allHaveLoaded) {
			clearInterval(interval)
			console.log({ allScripts }, (window as any).moment, (window as any).d3)
			onReady()
		} else if (maxTimeReached) {
			clearInterval(interval)
			throw new Error('Timed out fetching scripts')
		}
	}, 10)

	setTimeout(() => {
		maxTimeReached = true
	}, 5000)
}

const addCallback = (src: string, callback: Function): void => {
	const script = allScripts[src]
	if (!script) return

	clearTimeout(callbackTimeout)

	if (!script.hasLoaded) {
		if (script.callbacks.length > 0) {
			script.callbacks.push(callback)
		} else {
			script.callbacks = [callback]
		}
	}

	callbackTimeout = setTimeout(() => {
		waitForAllScriptsToBeReady(runCallbacks)
	}, 10)
}

export default function loadJS(src: string, callback: () => void): void {
	const script = allScripts[src] || defaultScript
	allScripts[src] = script
	if (alreadyCalledScripts.indexOf(src) < 0) {
		alreadyCalledScripts.push(src)
		const $scriptElem = document.createElement('script')
		$scriptElem.setAttribute('class', 'load-js-script')
		document.head.appendChild($scriptElem)
		$scriptElem.onload = (): void => {
			setTimeout(() => {
				addCallback(src, callback)
				const updatedScript = allScripts[src]
				if (updatedScript) {
					updatedScript.hasLoaded = true
				}
			}, 10)
		}
		$scriptElem.src = src
	} else {
		addCallback(src, callback)
	}
}
