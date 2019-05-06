export const notificationConfigurations = {
  DELETE: {
    '^(ftp|http|https):\/\/.*\/application\/.*\/role\/.*$': {
      success: 'Role has been deleted successfully.',
      error: 'Error while deleting role, please try again later.'
    }
  }
};
