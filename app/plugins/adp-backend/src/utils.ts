export function createTitle (name: string) {
    const nameValue = name.replace(/\s+/g, '-').toLowerCase().substring(0,64);
    return nameValue;
}