export function getUnique(arr: any) {
	let mapObj = new Map();

	arr.forEach((v: any) => {
		let prevValue = mapObj.get(v.name);
		if (!prevValue) {
			mapObj.set(v.name, v);
		}
	});
	return [...mapObj.values()];
}
