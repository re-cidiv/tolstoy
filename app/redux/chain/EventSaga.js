import {call, put, select} from 'redux-saga/effects';
import client from 'socketcluster-client';
import NotifyContent from 'app/components/elements/Notifications/NotifyContent'
// this should not exist after sagas restart fixing
let started = false;
//
function socketEventIterator(channel) {
  let resolveNextValue, resolved;
  resolved = true;
  //
  const options = {
    hostname: 'push.golos.io',
    secure: true,
  };
  const socket = client.create(options);
  const chan = socket.subscribe(channel);
  // todo !!!!!!!! this is a motherfucking saga reloading on transfer for example
  // this subscribes twice causing event doubling
  if (!started) {
    chan.watch(
      event => {
        // console.log(`----------------------------------------- `, event)
        resolveNextValue(event);
        resolved = true;
      })
    started = true
  }
  //
  return () => {
    if (!resolved) {
      throw new Error('Iterator can be used by only one agent.');
    }
    //
    resolved = false;
    //
    return new Promise((resolve) => {
      resolveNextValue = resolve;
    });
  };
}
//
export default function* channelListener() {
  console.log('<<<<<<<<< start listening to push.golos.io ...')
  const current = yield select(state => state.user.get('current'));
  const channel = current.get('username');
  const next = yield call(socketEventIterator, channel)
  while (true) {
    const action = yield call(next);
    console.log(action)
    yield put({
      type: 'ADD_NOTIFICATION',
      payload: NotifyContent(action)
    })
  }
}