const errorMessages = {
  insufficientPermissions:
    'No tienes el permiso necesario para ejecutar este comando.',
  botInsufficientPermissions:
    'No tengo el permiso necesario para ejecutar este comando.',
  userNotInServer: 'El usuario no existe en este servidor.',
  cannotUseAgainst: 'No puedes usar eso contra mí.',
  adminUserCannot: 'El usuario es administrador, no puedo hacer eso.',
  cannotSelfAction: (action) => `No puedes ${action} a ti mismo`,
  cannotPerformAction: (action) =>
    `No puedes ${action} al usuario porque tiene un rango igual/superior al tuyo`,
  cannotPerformActionByBot: (action) =>
    `No puedo ${action} al usuario porque tiene un rango igual/superior al mío`,
}

module.exports = { errorMessages }
