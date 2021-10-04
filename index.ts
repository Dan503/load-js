interface AllScripts {
	[scriptSource: string]: undefined | Script
}

interface Script {
	hasLoaded: boolean
	isLoading: boolean
	source: string
	lastOrdinal: number
	callbacks: {
		[callbackID: string]: {
			hasBeenCalled: boolean
			cb: Function
			id: string,
			ordinal: number
		}
	}
}

const allScripts: AllScripts = {}
const defaultScript = (source: string): Script => ({ source, hasLoaded: false, isLoading: false, callbacks: {}, lastOrdinal: 0 })

const generateID = (): string => {
	const randomNumber = Math.random()
	return `id-${randomNumber}`.replace('.', '')
}

const createScriptElem = (src: string, onLoad: () => void) => {
	const $scriptElem = document.createElement('script')
	$scriptElem.setAttribute('class', 'load-js-script')
	document.head.appendChild($scriptElem)
	$scriptElem.onload = onLoad
	$scriptElem.src = src
}

export default function loadJS(src: string, callback: () => void): void {
	const script = allScripts[src] || defaultScript(src)
	const { callbacks, hasLoaded, isLoading, lastOrdinal } = script

	const allCallBackIds = Object.keys(callbacks)
	const callbackID = allCallBackIds.find(cbId => callbacks[cbId].cb === callback)

	if (hasLoaded && !isLoading) {
		if (callbackID) {
			const { cb, hasBeenCalled } = callbacks[callbackID]
			if (!hasBeenCalled) {
				cb()
				callbacks[callbackID].hasBeenCalled = true
			}
		} else {
			const newCallbackID = generateID()
			const newOrdinal = lastOrdinal + 1
			callback()
			callbacks[newCallbackID] = {
				cb: callback,
				hasBeenCalled: true,
				id: newCallbackID,
				ordinal: newOrdinal,
			}
			script.lastOrdinal = newOrdinal
		}
	}

	if (!hasLoaded && isLoading) {
		if (!callbackID) {
			const cbId = generateID()
			const newOrdinal = lastOrdinal + 1
			callbacks[cbId] = {
				cb: callback,
				hasBeenCalled: false,
				id: cbId,
				ordinal: newOrdinal,
			}
			script.lastOrdinal = newOrdinal
			allScripts[src] = script
		}
	}

	if (!hasLoaded && !isLoading) {
		script.isLoading = true

		createScriptElem(src, () => {
			script.isLoading = false
			script.hasLoaded = true
			script.source = src

			if (!callbackID) {
				const cbId = generateID()
				callbacks[cbId] = {
					cb: callback,
					hasBeenCalled: true,
					id: cbId,
					ordinal: 0,
				}
				allScripts[src] = script
			}

			const allCbIds = Object.keys(callbacks).sort((a, b): 1 | 0 | -1 => {
				if (callbacks[a].ordinal < callbacks[b].ordinal) {
					return -1
				}
				if (callbacks[a].ordinal > callbacks[b].ordinal) {
					return 1
				}
				return 0
			})
			allCbIds.forEach(cbId => {
				callbacks[cbId].cb()
			})
		})
	}

	allScripts[src] = script
}
