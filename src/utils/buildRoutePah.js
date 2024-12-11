export function buildRoutePath(path) {
    const routeParametersRegex = /:([a-z]+)/ig;
    //$1 representa o 1º grupo de captura da regex utilizada dentro do replaceAll
    //replace utilizando a flag "g" é o mesmo que utilizar replaceAll
    const pathWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)');

    const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?`);

    return pathRegex;
}