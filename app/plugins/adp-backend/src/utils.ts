export function createName (name: string) {
    const nameValue = name.replace(/\s+/g, '-').toLowerCase().substring(0,64);
    return nameValue;
}

export function createTitle(title:string, alias?: string) {
    const titleValue =  alias ? (title + " " + `(${alias})`) : title
    return titleValue;
}