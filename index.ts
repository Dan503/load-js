const alreadyCalledSources: Array<string> = []

interface Callbacks {
	[key: string]: {
		hasLoaded: boolean
		callbacks: Array<Function>
	}
}

const awaitingCallbacks: Callbacks = {}

const addCallback = (src: string, callback: Function): void => {
	if (awaitingCallbacks[src].hasLoaded) {
		// If the script has already been previously loaded, just run the callback immediately
		callback()
	} else {
		if (awaitingCallbacks[src].callbacks) {
			awaitingCallbacks[src].callbacks.push(callback)
		} else {
			awaitingCallbacks[src].callbacks = [callback]
		}
	}
}

export default function loadJS(src: string, callback: () => void): void {
	awaitingCallbacks[src] = awaitingCallbacks[src] || {}
	if (alreadyCalledSources.indexOf(src) < 0) {
		alreadyCalledSources.push(src)
		const script = document.createElement('script')
		script.setAttribute('class', 'load-js-script')
		script.src = src
		script.onload = (): any => {
			addCallback(src, callback)
			awaitingCallbacks[src].hasLoaded = true
			for (const key in awaitingCallbacks) {
				awaitingCallbacks[key].callbacks.forEach(cb => cb())
			}
		}
		document.head.appendChild(script)
		console.log(document.head)
	} else {
		addCallback(src, callback)
	}
}
