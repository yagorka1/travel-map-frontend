import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectProfile } from '../../../../core/store/profile/profile.selectors';
import * as ProfileActions from '../../../../core/store/profile/profile.actions';
import { CommonModule } from '@angular/common';
import { ProfileInterface, UpdateProfileDto } from '../../../../pages/settings/interfaces/profile.interface';
import { InputComponent, AvatarComponent } from '@app/core';
import { SelectComponent, SelectOption } from '@app/core/components/select/select.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageEnum } from '@app/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputComponent,
    SelectComponent,
    TranslateModule,
    AvatarComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private translateService = inject(TranslateService);

  public profileForm!: FormGroup;

  public currentProfile: ProfileInterface | null = null;
  public selectedFile: File | null = null;

  public languages: SelectOption[] = [
    { value: LanguageEnum.EN, label: 'English' },
    { value: LanguageEnum.RU, label: 'Русский' },
    { value: LanguageEnum.BE, label: 'Беларуская' },
  ];

  public ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      language: [null, [Validators.required]],
    });

    this.store
      .select(selectProfile)
      .pipe(untilDestroyed(this))
      .subscribe((profile: ProfileInterface | null) => {
        this.currentProfile = profile;

        if (profile) {
          this.profileForm.patchValue({
            name: profile.name,
            language: profile.language,
          });

          if (profile.language && profile.language !== this.translateService.currentLang) {
            this.translateService.use(profile.language);
          }
        }
      });
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
    }
  }

  public onSubmit(): void {
    if (this.profileForm.valid) {
      const formValue = this.profileForm.value;
      const updateData: Partial<UpdateProfileDto> = {
        ...formValue,
      };

      if (this.selectedFile) {
        updateData.avatarUrl = this.selectedFile;
      }

      this.store.dispatch(ProfileActions.updateProfile({ profile: updateData }));
      this.selectedFile = null;
    }
  }
}
