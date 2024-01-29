export function createTitle (name: string) {
    const nameValue = name.replace(/\s+/g, '-').toLowerCase();
    return nameValue;
}