import moduleAlias from 'module-alias';
import path from 'path';

// Đăng ký alias
moduleAlias.addAliases({
  '~': path.resolve(__dirname, './')
});
