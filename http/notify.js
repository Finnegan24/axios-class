class HNotify {
  static defaults = {
    status: (status) => status >= 200 && status < 300,
    code: (code) => code === 0,

    error: (message, duration) => console.error(message),
    maps: {},
  };

  constructor() {}

  static init(opts = HNotify.defaults) {
    if (opts.status) HNotify.defaults.validators.status = opts.status;
    if (opts.code) HNotify.defaults.validators.code = opts.code;
    if (opts.error) HNotify.defaults.error = opts.error;
    if (Reflect.has(opts, "maps")) HNotify.defaults.maps = opts.maps;
  }
}
