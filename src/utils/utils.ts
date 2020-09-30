export default class Util {
  statusCode: number | null;
  type: string | null;
  data: any;
  message: string | null;

  constructor() {
    this.statusCode = null;
    this.type = null;
    this.data = null;
    this.message = null;
  }

  setSuccess(
    statusCode: number | null,
    message: string | null,
    data?: any | null,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.type = 'success';
  }

  setError(statusCode: number | null, message: string | null) {
    this.statusCode = statusCode;
    this.message = message;
    this.type = 'error';
  }

  send(res: any) {
    const result = {
      status: this.type,
      message: this.message,
      data: this.data,
    };

    if (this.type === 'success') {
      return res.status(this.statusCode).json(result);
    }
    return res.status(this.statusCode).json({
      status: this.type,
      message: this.message,
    });
  }
}
