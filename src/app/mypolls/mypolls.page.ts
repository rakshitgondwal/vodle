import { Component, OnInit } from "@angular/core";
import { NavController, LoadingController } from "@ionic/angular";
import { GlobalService } from "../global.service";
import { Poll } from "../poll";

@Component({
  selector: "app-mypolls",
  templateUrl: "./mypolls.page.html",
  styleUrls: ["./mypolls.page.scss"],
})
export class MypollsPage implements OnInit {
  public Object = Object;

  constructor(
    public g: GlobalService,
    public navCtrl: NavController,
    public loadingController: LoadingController
  ) {}

  async ngOnInit() {
    const loadingElement = await this.loadingController.create({
      message: "Getting Polls",
      spinner: "crescent",
    });
    await loadingElement.present();
    this.g.checkGroup(true).subscribe((promise) => {
      loadingElement.dismiss();
      promise.then((acc) => {
        if (acc == false) {
          this.g.presentAlert(
            "Wrong Credentials",
            "Please enter your right user credentials and use implemented refresh buttons!"
          );
          this.navCtrl.navigateBack("/home");
        } else {
          GlobalService.log("Successful Login to Group");
          // already before this.g.checkUser();
          // TODO: what if reloading page
        }
      });
    }),
      (error: {}) => {
        this.g.presentAlert(
          "Wrong Credentials",
          "Please ask your group admin for the right encoded passwords!"
        );
      };
  }
  ionViewDidEnter() {}

  newPoll() {
    this.navCtrl.navigateForward("/newpoll");
  }
  async refresh() {
    const refreshElement = await this.loadingController.create({
      message: "Updating Polls",
      spinner: "crescent",
    });
    await refreshElement.present();

    this.g.checkGroup(true).subscribe((promise) => {
      promise.then((acc) => {
        refreshElement.dismiss();
        if (acc == false) {
          this.g.presentAlert(
            "Wrong Credentials",
            "Please enter your user credentials first!"
          );
          this.navCtrl.navigateBack("/home");
        }
      });
    });
  }
}
