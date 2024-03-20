const errorMessages = {
  insufficientPermissions:
    'No tienes el permiso necesario para ejecutar este comando.',
  botInsufficientPermissions:
    'No tengo el permiso necesario para ejecutar este comando.',
  userNotFound: 'El usuario no se encuentra o su cuenta ha sido eliminada.',
  userNotInServer: 'El usuario no existe en este servidor.',
  cannotUseAgainst: 'No puedes usar eso contra mí.',
  adminUserCannot: 'El usuario es administrador, no puedo hacer eso.',
  cannotSelfAction: (action) => `No puedes ${action} a ti mismo.`,
  cannotPerformActionOnBot: (action) => `No puedes ${action} a un bot.`,
  cannotPerformRoleAction: (action) =>
    `No puedes ${action} al usuario porque tiene un rango igual/superior al tuyo.`,
  cannotPerformRoleActionByBot: (action) =>
    `No puedo ${action} al usuario porque tiene un rango igual/superior al mío.`,
  adminRoleManaged: (roleName) =>
    `El rol ${roleName} es administrado y no se puede agregar o remover.`,
  superiorRole: (action) =>
    `No puedo ${action} ese rol porque es superior al mío.`,
  everyoneRole: 'No puedes agregar o quitar el rol @everyone.',
}

module.exports = { errorMessages }
