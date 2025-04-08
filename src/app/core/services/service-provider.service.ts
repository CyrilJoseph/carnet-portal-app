import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { BasicDetail } from '../models/service-provider/basic-detail';
import { HttpClient } from '@angular/common/http';
import { Contact } from '../models/service-provider/contact';
import { UserService } from './user.service';
import { environment } from '../../../environments/environment';
import { CarnetSequence } from '../models/service-provider/carnet-sequence';

@Injectable({
  providedIn: 'root'
})
export class ServiceProviderService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private userService: UserService) { }

  getBasicDetailsById(id: number): BasicDetail | any {
    return this.http.get<any[]>(`${this.apiUrl}/oracle/GetSelectedServiceprovider?p_spid=${id}`).pipe(
      map(response => this.mapToBasicDetail(response)));
  }

  private mapToBasicDetail(basicDetails: any): BasicDetail {
    return {
      spid: basicDetails.SPID,
      companyName: basicDetails.NAMEOF,
      lookupCode: basicDetails.LOOKUPCODE,
      address1: basicDetails.ADDRESS1,
      address2: basicDetails.ADDRESS2,
      city: basicDetails.CITY,
      state: basicDetails.STATE,
      country: basicDetails.COUNTRY,
      issuingRegion: basicDetails.ISSUINGREGION,
      replacementRegion: basicDetails.REPLACEMENTREGION,
      zip: basicDetails.ZIP,
      cargoSurety: basicDetails.cargoSurety,
      cargoPolicyNo: basicDetails.cargoPolicyNo,
      bondSurety: basicDetails.bondSurety
    };
  }

  createBasicDetails(data: BasicDetail): Observable<any> {

    const basicDetails = {
      p_name: data.companyName,
      p_lookupcode: data.lookupCode,
      p_address1: data.address1,
      p_address2: data.address2,
      p_city: data.city,
      p_state: data.state,
      p_zip: data.zip,
      p_country: data.country,
      p_issuingregion: data.issuingRegion,
      p_replacementregion: data.replacementRegion,
      p_bondsurety: null,
      p_cargopolicyno: null,
      p_cargosurety: null,
      p_user_id: this.userService.getUser(),
    }

    return this.http.post(`${this.apiUrl}/oracle/InsertNewServiceProvider`, basicDetails);
  }

  updateBasicDetails(id: number, data: BasicDetail): Observable<any> {

    const basicDetails = {
      p_spid: id,
      p_name: data.companyName,
      p_lookupcode: data.lookupCode,
      p_address1: data.address1,
      p_address2: data.address2,
      p_city: data.city,
      p_state: data.state,
      p_zip: data.zip,
      p_country: data.country,
      p_issuingregion: data.issuingRegion,
      p_replacementregion: data.replacementRegion,
      // p_bondsurety: data.bondSurety,
      // p_cargopolicyno: data.cargoPolicyNo,
      // p_cargosurety: data.cargoSurety,
      p_user_id: this.userService.getUser(),
    }

    return this.http.put(`${this.apiUrl}/oracle/UpdateServiceProvider`, basicDetails);
  }

  getContactsById(id: number): Observable<Contact[]> {
    return this.http.get<any[]>(`${this.apiUrl}/oracle/GetSPAllContacts?p_SPid=${id}`).pipe(
      map(response => this.mapToContacts(response)));
  }

  private mapToContacts(data: any[]): Contact[] {
    return data.map(contact => ({
      spContactId: contact.SPCONTACTID,
      serviceProviderId: contact.SPID,
      defaultContact: contact.DEFCONTACTFLAG === 'Y',
      firstName: contact.FIRSTNAME,
      lastName: contact.LASTNAME,
      title: contact.TITLE,
      phone: contact.PHONENO,
      mobile: contact.MOBILENO,
      fax: contact.FAXNO || null,
      email: contact.EMAILADDRESS,
      middleInitial: contact.MIDDLEINITIAL || null
    }));
  }

  createContact(spid: number, data: Contact): Observable<any> {

    const contact = {
      p_spid: spid,
      p_defcontactflag: data.defaultContact ? 'Y' : 'N',
      p_firstname: data.firstName,
      p_lastname: data.lastName,
      P_MIDDLEINITIAL: data.middleInitial,
      p_title: data.title,
      p_phoneno: data.phone,
      p_mobileno: data.mobile,
      p_faxno: data.fax,
      p_emailaddress: data.email,
      p_user_id: this.userService.getUser()
    }

    return this.http.post(`${this.apiUrl}/oracle/InsertSPContacts`, contact);
  }

  updateContact(spContactId: number, data: Contact): Observable<any> {

    const contact = {
      p_spcontactid: spContactId,
      //p_defcontactflag: data.defaultContact ? 'Y' : 'N',
      p_firstname: data.firstName,
      p_lastname: data.lastName,
      P_MIDDLEINITIAL: data.middleInitial,
      p_title: data.title,
      p_phoneno: data.phone,
      p_mobileno: data.mobile,
      p_faxno: data.fax,
      p_emailaddress: data.email,
      p_user_id: this.userService.getUser()
    }

    return this.http.put(`${this.apiUrl}/oracle/UpdateSPContacts`, contact);
  }

  deleteContact(spContactId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/oracle/InactivateSPContact/${spContactId}`, null);
  }

  getCarnetSequenceById(id: number): Observable<CarnetSequence[]> {
    return this.http.get<any[]>(`${this.apiUrl}/oracle/GetCarnetSequence?p_spid=${id}`).pipe(
      map(response => this.mapToCarnetSequence(response)));
  }

  private mapToCarnetSequence(data: any[]): CarnetSequence[] {
    return data.map(item => ({
      spid: item.SPID,
      region: item.REGIONID,
      carnetType: item.CARNETTYPE,
      startNumber: item.STARTNUMBER,
      endNumber: item.ENDNUMBER,
      lastNumber: item.LASTNUMBER
    }));
  }

  createCarnetSequence(data: CarnetSequence): Observable<any> {

    const carnetSequence = {
      p_spid: data.spid,
      p_regionid: data.region,
      p_startnumber: data.startNumber,
      p_endnumber: data.endNumber,
      p_carnettype: data.carnetType
    }

    return this.http.post(`${this.apiUrl}/oracle/CreateCarnetSequence`, carnetSequence);
  }
}
