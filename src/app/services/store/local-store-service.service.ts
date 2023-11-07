import { JsonPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Firestore, getFirestore, collection, getDocsFromServer, getDocs, setDoc, doc, getDoc, addDoc,query, where, deleteField, updateDoc } from '@angular/fire/firestore';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, Auth, UserCredential, user } from '@angular/fire/auth'
import { IUser } from 'src/app/interfaces/user.interface';
import { ITask } from 'src/app/interfaces/task.interface';
import { object } from '@angular/fire/database';


@Injectable({
  providedIn: 'root'
})
export class LocalStoreService {

  constructor(private firestore: Firestore) { }

  private STORE = localStorage;
  private sessionStore = sessionStorage; // this is good dev work
  private db = getFirestore();

  set(key: string, data: any) {
    try {
      let response: any[] = <any>this.STORE.getItem(key);

      if (response == null) {

        this.STORE.setItem(key, JSON.stringify([]));
        let localResponse:any[] = <any>this.STORE.getItem(key);
        localResponse = JSON.parse(<any>localResponse);

        localResponse.push(data);

        this.STORE.setItem(key, <any>JSON.stringify(localResponse));
        return true;

      }
    
      response = JSON.parse(<any>response);
      response.push(data)

      this.STORE.setItem(key, JSON.stringify(response)); 
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async deleteItemFirestore(keyCollection: string, uId: string, field: string) {
    const fieldRef = doc(this.db, keyCollection, uId);
    let response: {
      status: boolean,
      results: any
    };

    response = await updateDoc(fieldRef, {
      [field]: deleteField()
    }).then((data)=>{
      console.log(data);
      return {status: true, results: data}

    }).catch((err)=>{
      console.log(err)
      return {status: false, results: err}
    })

    return response;
  }

  async setFireStore(key: string, userId: string ,data: ITask): Promise<{state: boolean, response: any}> {
    const db = getFirestore();
    let taskId: number;
    const keyCollection = collection(db, key);
    console.log(userId);
    let pastData: any;
    const gotten = await getDoc(doc(keyCollection, userId))
    .then((dataH) => {
      console.log(dataH.data());
      pastData = dataH.data();
      taskId = Object.keys(pastData).length;
      data['id'] = Object.keys(pastData).length + 1;

      console.log(taskId);
    })
    .catch((err)=> {
      console.log(err);
    })

    let response: {
      state: boolean,
      response: any
    };

    let taskKey = data.name
    
    const respons = await setDoc(doc(keyCollection, userId), {[taskKey]:data, ...pastData})
    .then((succ) => {
      console.log(succ)
      response = {
        state: true,
        response: succ
      }
    })
    .catch((err) => {
      console.log(err);
      response = {
        response: err,
        state: false
      }
    })

    console.log(respons)

    return response!;

  }

  async getFireStore(key: string, uId: string) {
    const db = getFirestore();
    const keyCollection = collection(db, key);

    let response: {
      status: boolean,
      results: any
    };
    const tasks = await getDoc(doc(keyCollection, uId))
    .then((data)=>{response = {status: true, results: data.data()}})
    .catch((err)=>{response = {status: false, results: err}})

    console.log(response!);
    return response!;

  }

  async createUser(auth: Auth, data: IUser): Promise<{user: UserCredential, state: boolean}> {
    let response:{user: UserCredential, state: boolean}
    try {
      console.log(data.email, data.password)
      const respons = await createUserWithEmailAndPassword(auth, data.email, data.password)
        .then((userI) => { console.log(userI); response = {user: userI, state: true} })
        .catch((err) => { response = {user: err, state: false} })
    }
    catch (error) {
      console.log(error);
    }

    return response!;
  }

  get(key: string) {
    try {
      const response = JSON.parse(this.STORE.getItem(key) ?? '');
      return {
        status: true,
        data: response
      }
    } catch (error) {
      return {
        status: false,
        data: null
      }
    }
  }

  update(key: string, data: any) {
    this.STORE.setItem(key, JSON.stringify(data));
    return true
  }

  sessionStorageGet(key: string) {
    try {
      const response = JSON.parse(this.sessionStore.getItem(key) ?? '');
      return {
        status: true,
        data: response
      }

    }
    catch (error) {
      return {
        status: false,
        data: null
      }
    }
  }

  sessionStorage(key: string ,data: any) {
    this.sessionStore.setItem(key, JSON.stringify(data));
    return true;
  }

  clearSStorage() {
    this.sessionStore.clear();
  }

}
