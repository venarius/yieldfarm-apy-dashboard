import Symbols from '../config/constants/symbols'

export function lpSymbolToImage (lpSymbol, index) {
  if (index === 0) {
    return Symbols[lpSymbol.split('-')[0].toUpperCase()] ? 'token/images/' + Symbols[lpSymbol.split('-')[0].toUpperCase()] + '_32.png' : 'images/main/empty-token.png'
  }
  return Symbols[lpSymbol.split('-')[1].split(' ')[0].toUpperCase()] ? 'token/images/' + Symbols[lpSymbol.split('-')[1].split(' ')[0].toUpperCase()] + '_32.png' : 'images/main/empty-token.png'
}